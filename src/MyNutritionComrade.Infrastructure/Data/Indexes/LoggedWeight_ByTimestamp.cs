using System.Linq;
using MyNutritionComrade.Core.Domain.Entities;
using Raven.Client.Documents.Indexes;

namespace MyNutritionComrade.Infrastructure.Data.Indexes
{
    public class LoggedWeight_ByTimestamp : AbstractIndexCreationTask<LoggedWeight>
    {
        public LoggedWeight_ByTimestamp()
        {
            Map = weight => weight.Select(x => new {x.UserId, x.Timestamp});
        }
    }
}
