using System.Collections.Generic;
using System.Linq;
using MyNutritionComrade.Core.Domain;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Services;
using MyNutritionComrade.Infrastructure.Utilities;
using Newtonsoft.Json;

namespace MyNutritionComrade.Infrastructure.Patch
{
    public class PatchFactory : IObjectPatchFactory
    {
        private readonly JsonSerializerSettings _productInfoContractResolver;

        public PatchFactory(JsonSerializerSettings settings)
        {
            settings.ContractResolver = new InterfaceContractResolver(typeof(ProductInfo));
            _productInfoContractResolver = settings;
        }

        public List<PatchOperation> CreatePatch<T>(T original, T modified) where T : class => PatchCreator.CreatePatch(original, modified).ToList();

        public void ExecutePatch(IEnumerable<PatchOperation> operations, object o)
        {
            PatchExecutor.Execute(operations, o);
        }

        public IEnumerable<PatchOperation[]> GroupPatches(IEnumerable<PatchOperation> operations) => ProductPatchReducer.ReducePatch(operations);

        public ProductInfo Copy(ProductInfo productInfo) =>
            JsonConvert.DeserializeObject<ProductInfo>(JsonConvert.SerializeObject(productInfo, _productInfoContractResolver));

        public bool Compare(ProductInfo product1, ProductInfo product2) =>
            JsonConvert.SerializeObject(product1, _productInfoContractResolver) == JsonConvert.SerializeObject(product2, _productInfoContractResolver);
    }
}
