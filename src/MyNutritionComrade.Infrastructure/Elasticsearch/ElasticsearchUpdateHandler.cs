using System.Threading.Tasks;
using AutoMapper;
using MyNutritionComrade.Core.Domain.Entities;
using MyNutritionComrade.Core.Interfaces.Gateways;
using Nest;

namespace MyNutritionComrade.Infrastructure.Elasticsearch
{
    public class ElasticsearchUpdateHandler : IProductsChangedEventHandler
    {
        private readonly IElasticClient _client;
        private readonly IMapper _mapper;

        public ElasticsearchUpdateHandler(IElasticClient client, IMapper mapper)
        {
            _client = client;
            _mapper = mapper;
        }

        public async ValueTask AddProduct(Product product)
        {
            var searchEntry = _mapper.Map<ProductSearchEntry>(product);
            await _client.IndexAsync(searchEntry, x => x);
        }

        public async ValueTask UpdateProduct(Product product)
        {
            var searchEntry = _mapper.Map<ProductSearchEntry>(product);
            await _client.UpdateAsync<ProductSearchEntry>(searchEntry.Id, x => x.Doc(searchEntry));
        }

        public async ValueTask RemoveProduct(Product product)
        {
            var searchEntry = _mapper.Map<ProductSearchEntry>(product);
            await _client.DeleteAsync(new DocumentPath<ProductSearchEntry>(searchEntry), x => x);
        }
    }
}
