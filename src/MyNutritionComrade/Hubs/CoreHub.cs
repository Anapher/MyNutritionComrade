using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MyNutritionComrade.Hubs
{
    [Authorize]
    public class CoreHub : Hub
    {
    }
}
