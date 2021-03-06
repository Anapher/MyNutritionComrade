﻿using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace MyNutritionComrade.Infrastructure.Utilities
{
    public class InterfaceContractResolver : DefaultContractResolver
    {
        private readonly Type _interfaceType;

        public InterfaceContractResolver( Type interfaceType)
        {
            _interfaceType = interfaceType;
        }

        protected override IList<JsonProperty> CreateProperties(Type type, MemberSerialization memberSerialization)
        {
            if (_interfaceType.IsAssignableFrom(type))
                return base.CreateProperties(_interfaceType, memberSerialization);

            return base.CreateProperties(type, memberSerialization);
        }
    }
}
