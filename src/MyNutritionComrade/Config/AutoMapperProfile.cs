using System.Linq;
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
            CreateMap<Product, ProductSearchDto>().ForMember(x => x.DefaultServing, x => x.MapFrom(p => p.DefaultServing.Name))
                .ForMember(x => x.Servings, x => x.MapFrom(p => p.Servings.ToDictionary(y => y.Key.Name, y => y.Value)));

            CreateMap<Product, ProductDto>();
            CreateMap<ConsumedProduct, ConsumedProductDto>();
            CreateMap<Product, FrequentlyUsedProductDto>();
        }
    }
}
