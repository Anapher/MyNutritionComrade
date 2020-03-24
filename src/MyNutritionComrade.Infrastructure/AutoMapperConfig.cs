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
            CreateMap<Product, ProductSearchEntry>().ForMember(x => x.ProductName, x => x.MapFrom(y => y.Label.Select(l => l.Label).ToArray()))
                .ForMember(x => x.ServingTypes, x => x.MapFrom(y => y.Servings.ToArray()))
                .ForMember(x => x.Servings, x => x.MapFrom(y => y.Servings.ToDictionary(z => z.Key.ToString(), z => z.Value)))
                .ForMember(x => x.DefaultServing, x => x.MapFrom(y => y.DefaultServing.ToString()));
        }
    }
}
