using System.Threading.Tasks;
using CommunityCatalog.Core.Requests;
using CommunityCatalog.Models.Request;
using CommunityCatalog.Models.Response;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CommunityCatalog.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthenticationController : Controller
    {
        private readonly IMediator _mediator;

        public AuthenticationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("request_password")]
        [AllowAnonymous]
        public async Task<ActionResult> RequestPassword([FromBody] RequestPasswordDto dto)
        {
            await _mediator.Send(new LoginRequestPasswordRequest(dto.EmailAddress));
            return Ok();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var result = await _mediator.Send(new LoginRequest(dto.EmailAddress, dto.Password));
            return Ok(new LoginResponseDto(result));
        }
    }
}
