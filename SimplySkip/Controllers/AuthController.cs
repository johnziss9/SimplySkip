using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;

namespace SimplySkip.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<IdentityResult>> Register(AuthRequest authRequest)
        {
            return ResponseHelper.HandleErrorAndReturn(await _authService.Register(authRequest));
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(AuthRequest authRequest)
        {
            return ResponseHelper.HandleErrorAndReturn(await _authService.Login(authRequest));
        }
    }
}