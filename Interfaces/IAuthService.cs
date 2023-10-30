using Microsoft.AspNetCore.Identity;
using SimplySkip.Helpers;

namespace SimplySkip.Interfaces
{
    public interface IAuthService
    {
         Task<Response<IdentityResult>> Register(IdentityUser newUser, string password);

         Task<Response<LoginResponse>> Login(IdentityUser loginUser, string password);
    }
}