using System;
using System.Collections.Immutable;
using AutoMapper;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Response;
using Microsoft.AspNetCore.JsonPatch.Operations;
using MyNutritionComrade.Models;

namespace CommunityCatalog
{
    public class PresentationMappingProfile : Profile
    {
        public PresentationMappingProfile()
        {
            CreateMap<ProductContribution, ProductContributionDto>().ConstructUsing(x =>
                new ProductContributionDto(string.Empty, string.Empty, ProductContributionStatus.Pending, null,
                    ImmutableList<Operation>.Empty, DateTimeOffset.MinValue, false,
                    new ProductContributionStatisticsDto(0, 0), null));

            CreateMap<Product, ProductProperties>();
        }
    }
}
