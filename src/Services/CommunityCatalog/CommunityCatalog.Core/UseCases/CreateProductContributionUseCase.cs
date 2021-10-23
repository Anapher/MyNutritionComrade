using System.Threading;
using System.Threading.Tasks;
using CommunityCatalog.Core.Domain;
using CommunityCatalog.Core.Extensions;
using CommunityCatalog.Core.Gateways.Repos;
using CommunityCatalog.Core.Requests;
using MediatR;

namespace CommunityCatalog.Core.UseCases
{
    public class CreateProductContributionUseCase : IRequestHandler<CreateProductContributionRequest, string>
    {
        private readonly IMediator _mediator;
        private readonly IProductRepository _productRepository;
        private readonly IProductContributionRepository _productContributionRepository;

        public CreateProductContributionUseCase(IMediator mediator, IProductRepository productRepository,
            IProductContributionRepository productContributionRepository)
        {
            _mediator = mediator;
            _productRepository = productRepository;
            _productContributionRepository = productContributionRepository;
        }

        public async Task<string> Handle(CreateProductContributionRequest request, CancellationToken cancellationToken)
        {
            var (userId, productId, changes) = request;

            var productDocument = await _productRepository.FindById(request.ProductId);
            if (productDocument == null)
                throw ProductError.ProductNotFound(request.ProductId).ToException();

            var contribution = ProductContribution.Create(userId, productId, changes.Operations);
            try
            {
                await _productContributionRepository.Add(contribution);
                return contribution.Id;
            }
            catch
            {
                var existingContribution =
                    await _productContributionRepository.FindByPatchHash(productId, contribution.PatchHash);

                if (existingContribution == null)
                    throw;

                await _mediator.Send(new VoteProductContributionRequest(userId, existingContribution.Id, true));
                return existingContribution.Id;
            }
        }
    }
}
