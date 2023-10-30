using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

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
        public async Task<ActionResult<IdentityResult>> Register(IdentityUser user, string password)
        {
            return ResponseHelper.HandleErrorAndReturn(await _authService.Register(user, password));
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(IdentityUser user, string password)
        {
            return ResponseHelper.HandleErrorAndReturn(await _authService.Login(user, password));
        }
    }
}