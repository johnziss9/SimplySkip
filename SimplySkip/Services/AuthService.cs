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

        // public async Task<Response<IdentityResult>> Register(IdentityUser newUser, string password)
        // {
        //     if (newUser == null)
        //     {
        //         return Response<IdentityResult>.Fail(400, "Please provide user information.");
        //     }

        //     var user = await _userManager.FindByNameAsync(newUser.UserName);

        //     if (user != null)
        //     {
        //         return Response<IdentityResult>.Fail(400, "Username already exists.");
        //     }

        //     var hashedPassword = _userManager.PasswordHasher.HashPassword(user, password);

        //     newUser.PasswordHash = hashedPassword;

        //     var result = await _userManager.CreateAsync(newUser);

        //     return Response<IdentityResult>.Success(result);
        // }

        public async Task<Response<IdentityResult>> Register(AuthRequest authRequest)
        {
            if (authRequest == null || string.IsNullOrWhiteSpace(authRequest.UserName) || string.IsNullOrWhiteSpace(authRequest.Password))
            {
                return Response<IdentityResult>.Fail(400, "Username and/or password cannot be null.");
            }

            var user = await _userManager.FindByNameAsync(authRequest.UserName);

            if (user != null)
            {
                return Response<IdentityResult>.Fail(400, "Username already exists.");
            }

            var newUser = new IdentityUser();

            newUser.UserName = authRequest.UserName;
            newUser.PasswordHash = _userManager.PasswordHasher.HashPassword(newUser, authRequest.Password);

            var result = await _userManager.CreateAsync(newUser);

            return Response<IdentityResult>.Success(result);
        }

        // public async Task<Response<LoginResponse>> Login(IdentityUser loginUser, string password)
        // {
        //     if (loginUser == null || string.IsNullOrWhiteSpace(loginUser.UserName) || string.IsNullOrWhiteSpace(password))
        //     {
        //         return Response<LoginResponse>.Fail(400, "The user cannot be null.");
        //     }

        //     var user = await _userManager.FindByNameAsync(loginUser.UserName);

        //     if (user != null && await _userManager.CheckPasswordAsync(user, password))
        //     {
        //         var token = GenerateToken(user);

        //         return Response<LoginResponse>.Success(new LoginResponse(IdentityResult.Success, token));
        //     }

        //     return Response<LoginResponse>.Fail(400, "Invalid username or password.");
        // }

        public async Task<Response<LoginResponse>> Login(AuthRequest authRequest)
        {
            if (authRequest == null || string.IsNullOrWhiteSpace(authRequest.UserName) || string.IsNullOrWhiteSpace(authRequest.Password))
            {
                return Response<LoginResponse>.Fail(400, "Username and/or password cannot be null.");
            }

            var user = await _userManager.FindByNameAsync(authRequest.UserName);

            if (user != null && await _userManager.CheckPasswordAsync(user, authRequest.Password))
            {
                var token = GenerateToken(user);

                return Response<LoginResponse>.Success(new LoginResponse(IdentityResult.Success, token, user.Id));
            }

            return Response<LoginResponse>.Fail(400, "Invalid username or password.");
        }


        public string GenerateToken(IdentityUser user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "defaultKeyValue";
            var userName = user?.UserName ?? "";
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var durationInMinutes = int.TryParse(_configuration["Jwt:DurationInMinutes"], out int duration) ? duration : 0;

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(durationInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}