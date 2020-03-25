using System.Linq;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Infrastructure.Elasticsearch;

namespace MyNutritionComrade.Infrastructure
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<Product, ProductSearchEntry>().ForMember(x => x.ProductName, x => x.MapFrom(y => y.Label.Select(l => l.Value).ToArray()))
                .ForMember(x => x.ServingTypes, x => x.MapFrom(y => y.Servings.Keys))
                .ForMember(x => x.Servings, x => x.MapFrom(y => y.Servings.ToDictionary(z => z.Key.ToString(), z => z.Value)));
        }
    }
}
