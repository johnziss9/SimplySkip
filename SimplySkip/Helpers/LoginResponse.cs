using Microsoft.AspNetCore.Identity;

namespace SimplySkip.Helpers
{
    public class LoginResponse : Response<IdentityResult>
    {
        public string Token { get; set; }

        public LoginResponse(IdentityResult result, string token) : base(result)
        {
            Token = token;
        }
    }
}