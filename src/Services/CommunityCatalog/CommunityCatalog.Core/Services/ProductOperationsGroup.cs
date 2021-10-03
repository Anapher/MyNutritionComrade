using System;
using System.Collections.Generic;
using System.Linq;
using CommunityCatalog.Core.Extensions;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;

namespace CommunityCatalog.Core.Services
{
    public record ProductOperationsGroup(IReadOnlyList<Operation> Operations)
    {
        public static IEnumerable<ProductOperationsGroup> GroupOperations(IEnumerable<Operation> operations)
        {
            var clonedOps = operations.ToList();

            var definitions = new List<OperationGroupDefinition>
            {
                new ItemStateOperationGroupDefinition(), new NutritionalInfoGroupDefinition(),
            };

            var result = new List<ProductOperationsGroup>();
            foreach (var definition in definitions)
            {
                result.AddRange(definition.FindGroupsAndRemove(clonedOps));
            }

            result.AddRange(clonedOps.Select(x => new ProductOperationsGroup(new List<Operation> { x })));
            return result;
        }

        private abstract class OperationGroupDefinition
        {
            public abstract IEnumerable<ProductOperationsGroup> FindGroupsAndRemove(IList<Operation> operations);

            protected T? RemoveItemIfFound<T>(IList<T> items, Func<T, bool> predicate) where T : class
            {
                var item = items.FirstOrDefault(predicate);
                if (item != null)
                {
                    items.Remove(item);
                    return item;
                }

                return null;
            }
        }

        private class ItemStateOperationGroupDefinition : OperationGroupDefinition
        {
            public override IEnumerable<ProductOperationsGroup> FindGroupsAndRemove(IList<Operation> operations)
            {
                var gramChangeOp = RemoveItemIfFound(operations, x => x.path == $"/servings/{ServingType.Gram}");
                if (gramChangeOp != null)
                {
                    var mlChangeOp =
                        RemoveItemIfFound(operations, x => x.path == $"/servings/{ServingType.Milliliter}");
                    if (mlChangeOp == null)
                        throw new Exception("If the serving g is changed, ml must also be changed.");

                    var tagsChangeOp = RemoveItemIfFound(operations,
                        x => x.path == "/tags" && x.OperationType == OperationType.Remove ||
                             x.path == $"/tags/{ProductProperties.TAG_LIQUID}");
                    if (tagsChangeOp == null)
                        throw new Exception("If the serving g is changed, the tags must also be adjusted");


                    yield return new ProductOperationsGroup(new List<Operation>
                    {
                        gramChangeOp, mlChangeOp, tagsChangeOp,
                    });
                }
            }
        }

        private class NutritionalInfoGroupDefinition : OperationGroupDefinition
        {
            public override IEnumerable<ProductOperationsGroup> FindGroupsAndRemove(IList<Operation> operations)
            {
                var nutritionInfoChanges = operations.Where(x =>
                    x.path.StartsWith($"/{nameof(ProductProperties.NutritionalInfo).ToCamelCase()}/")).ToList();
                if (nutritionInfoChanges.Any())
                {
                    foreach (var op in nutritionInfoChanges)
                    {
                        operations.Remove(op);
                    }

                    yield return new ProductOperationsGroup(nutritionInfoChanges);
                }
            }
        }
    }
}
