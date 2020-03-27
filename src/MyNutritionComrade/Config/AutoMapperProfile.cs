using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Elasticsearch;
using MyNutritionComrade.Models.Response;

namespace MyNutritionComrade.Config
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ProductSearchEntry, ProductSearchDto>();
            CreateMap<Product, ProductDto>();
            CreateMap<ConsumedProduct, ConsumedProductDto>();
        }
    }
}
