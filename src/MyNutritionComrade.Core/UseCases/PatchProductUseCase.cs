using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using MyNutritionComrade.Core.Dto.UseCaseRequests;
using MyNutritionComrade.Core.Dto.UseCaseResponses;
using MyNutritionComrade.Core.Interfaces;
using MyNutritionComrade.Core.Interfaces.Gateways.Repositories;
using MyNutritionComrade.Core.Interfaces.UseCases;

namespace MyNutritionComrade.Core.UseCases
{
    public class PatchProductUseCase : UseCaseStatus<PatchProductRequest>, IPatchProductUseCase
    {
        private readonly IProductRepository _productRepository;

        public PatchProductUseCase(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<PatchProductResponse?> Handle(PatchProductRequest message)
        {
            var product = await _productRepository.FindById(message.ProductId);
            throw new NotImplementedException();
        }
    }
}
