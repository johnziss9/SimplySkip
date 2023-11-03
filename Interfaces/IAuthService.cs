using Microsoft.AspNetCore.Identity;
using SimplySkip.Helpers;

namespace SimplySkip.Interfaces
{
    public interface IAuthService
    {
         Task<Response<IdentityResult>> Register(AuthRequest authRequest);

         Task<Response<LoginResponse>> Login(AuthRequest authRequest);
    }
}