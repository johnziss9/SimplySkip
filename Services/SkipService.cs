using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Services
{
    public class SkipService : ISkipService
    {
        private readonly SSDbContext _ssDbContext;

        public SkipService(SSDbContext ssDbContext)
        {
            _ssDbContext = ssDbContext;
        }

        public async Task<Response<Skip>> CreateCustomer(Skip skip)
        {
            _ssDbContext.Skip.Add(skip);
            await _ssDbContext.SaveChangesAsync();

            return Response<Skip>.Success(skip);
        }
    }
}