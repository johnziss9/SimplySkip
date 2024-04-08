using Microsoft.AspNetCore.Identity;

namespace SimplySkip.Helpers
{
    public class LoginResponse : Response<IdentityResult>
    {
        public string Token { get; set; }

        public string UserId { get; set; }

        public LoginResponse(IdentityResult result, string token, string userId) : base(result)
        {
            Token = token;
            UserId = userId;
        }
    }
}