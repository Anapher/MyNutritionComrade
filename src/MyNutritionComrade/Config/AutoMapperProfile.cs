using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Models.Response;

namespace MyNutritionComrade.Config
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Product, ProductDto>();
            CreateMap<ConsumedProduct, ConsumedProductDto>();
            CreateMap<Product, FrequentlyUsedProductDto>();
            CreateMap<ProductContribution, ProductContributionDto>();
        }
    }
}
