using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Extensions;

namespace MyNutritionComrade.Infrastructure.Patch
{
    public static class PatchExecutor
    {
        public static void Execute(IEnumerable<PatchOperation> operations, object obj)
        {
            foreach (var operation in operations)
                if (operation is OpSetProperty opSetProperty)
                {
                    SetProperty(operation.Path, obj, type => opSetProperty.Value.ToObject(type));
                }
                else if (operation is OpUnsetProperty)
                {
                    SetProperty(operation.Path, obj, null);
                }
                else if (operation is OpAddItem || operation is OpRemoveItem)
                {
                    var listObj = ExtractPathObject(ExtractPathSegments(operation.Path), obj);
                    var itemType = GetGenericArgument(listObj.GetType(), typeof(IEnumerable<>)) ??
                                   throw new ArgumentException($"{operation.Path} is not an Enumerable<>.");

                    if (operation is OpAddItem opAddItem)
                    {
                        var item = opAddItem.Item.ToObject(itemType);
                        var addMethod = listObj.GetType().GetMethod("Add", new[] {itemType}) ??
                                        throw new ArgumentException($"{listObj.GetType()} must have an Add() method.");
                        addMethod.Invoke(listObj, new[] {item});
                    }
                    else if (operation is OpRemoveItem opRemoveItem)
                    {
                        var item = opRemoveItem.Item.ToObject(itemType);
                        var addMethod = listObj.GetType().GetMethod("Remove", new[] {itemType}) ??
                                        throw new ArgumentException($"{listObj.GetType()} must have an Add() method.");
                        addMethod.Invoke(listObj, new[] {item});
                    }
                }
        }

        private static void SetProperty(string path, object obj, Func<Type, object?>? getValue)
        {
            var segments = ExtractPathSegments(path).ToList();
            var baseObj = ExtractPathObject(segments.Take(segments.Count - 1), obj);
            var propertyName = segments.Last();

            if (baseObj is IDictionary dictionary)
            {
                var key = GetDictionaryKey(dictionary, propertyName.ToCamelCase());

                if (getValue == null)
                {
                    dictionary.Remove(key);
                    return;
                }

                var valueType = GetGenericArgument(dictionary.GetType(), typeof(IDictionary<,>), 1) ?? typeof(object);
                dictionary[key] = getValue(valueType);
                return;
            }

            var property = baseObj.GetType().GetProperty(propertyName);
            if (property == null)
                throw new ArgumentException($"The property {propertyName} does not exist on {baseObj.GetType()}");

            var value = getValue?.Invoke(property.PropertyType);
            property.SetValue(baseObj, value ?? GetDefault(property.PropertyType));
        }

        private static object? GetDefault(Type type)
        {
            if (type.IsValueType)
            {
                return Activator.CreateInstance(type);
            }
            return null;
        }

        private static object GetDictionaryKey(IDictionary dictionary, string key)
        {
            var keyType = GetGenericArgument(dictionary.GetType(), typeof(IDictionary<,>));
            if (keyType == typeof(string)) return key;

            var converter = TypeDescriptor.GetConverter(keyType);
            if (!converter.CanConvertFrom(typeof(string))) throw new ArgumentException("The type converter of the dictionary must support strings.");

            return converter.ConvertFrom(key);
        }

        private static object ExtractPathObject(IEnumerable<string> segments, object obj)
        {
            foreach (var segment in segments)
            {
                if (obj is IDictionary dictionary)
                {
                    var entry = dictionary[GetDictionaryKey(dictionary, segment)];

                    obj = entry ?? throw new ArgumentException($"The dictionary value with key {segment} is null.");
                    continue;
                }

                var type = obj.GetType();
                var property = type.GetProperty(segment);
                if (property == null)
                    throw new ArgumentException($"The property {segment} does not exist on {type}");

                var value = property.GetValue(obj);
                if (value == null)
                {
                    value = Activator.CreateInstance(property.PropertyType);
                    if (value == null)
                        throw new ArgumentException($"The property {property} is null and a new object of {property.PropertyType} could not be extracted");

                    property.SetValue(obj, value);
                }

                obj = value;
            }

            return obj;
        }

        private static Type? GetGenericArgument(Type type, Type genericInterface, int index = 0)
        {
            foreach (var i in type.GetInterfaces())
                if (i.IsGenericType && i.GetGenericTypeDefinition() == genericInterface)
                    return i.GetGenericArguments()[index];

            return null;
        }

        private static IEnumerable<string> ExtractPathSegments(string path) => path.Split('.').Select(x => x.ToPascalCase());
    }
}
