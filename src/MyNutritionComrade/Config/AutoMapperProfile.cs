using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Domain.Entities.Consumption;
using MyNutritionComrade.Models.Response;

namespace MyNutritionComrade.Config
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Product, ProductDto>();
            CreateMap<FoodPortionProduct, ConsumedDto>();
            CreateMap<Product, FrequentlyUsedProductDto>();
            CreateMap<ProductContribution, ProductContributionDto>();
            CreateMap<Product, FoodPortionProductDto>();
        }
    }
}
