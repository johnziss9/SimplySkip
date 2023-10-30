using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;

namespace SimplySkip.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;

        private readonly IPasswordHasher<IdentityUser> _passwordHasher;

        private readonly IConfiguration _configuration;

        
        public AuthService(UserManager<IdentityUser> userManager, IPasswordHasher<IdentityUser> passwordHasher, IConfiguration configuration)
        {
            _userManager = userManager;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
        }

        public async Task<Response<IdentityResult>> Register(IdentityUser newUser, string password)
        {
            if (newUser == null)
            {
                return Response<IdentityResult>.Fail(400, "Please provide user information.");
            }

            var user = await _userManager.FindByNameAsync(newUser.UserName);

            if (user != null)
            {
                return Response<IdentityResult>.Fail(400, "Username already exists.");
            }

            var hashedPassword = _userManager.PasswordHasher.HashPassword(user, password);

            newUser.PasswordHash = hashedPassword;

            var result = await _userManager.CreateAsync(newUser);

            return Response<IdentityResult>.Success(result);
        }

        public async Task<Response<LoginResponse>> Login(IdentityUser loginUser, string password)
        {
            if (loginUser == null || string.IsNullOrWhiteSpace(loginUser.UserName) || string.IsNullOrWhiteSpace(password))
            {
                return Response<LoginResponse>.Fail(400, "The user cannot be null.");
            }

            var user = await _userManager.FindByNameAsync(loginUser.UserName);

            if (user != null && await _userManager.CheckPasswordAsync(user, password))
            {
                // Authentication successful. Generate a token.
                var token = GenerateToken(user);

                // TODO Store or send the token as needed (e.g., in an HTTP cookie or response).
                // Response.Cookies.Append("access_token", token);

                return Response<LoginResponse>.Success(new LoginResponse(IdentityResult.Success, token));
            }

            return Response<LoginResponse>.Fail(400, "Invalid username or password.");
        }

        public string GenerateToken(IdentityUser user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(int.Parse(_configuration["Jwt:DurationInMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}   