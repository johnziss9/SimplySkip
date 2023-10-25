using Microsoft.EntityFrameworkCore;
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

        public async Task<Response<Skip>> AddSkip(Skip skip)
        {
            _ssDbContext.Skips.Add(skip);
            await _ssDbContext.SaveChangesAsync();

            return Response<Skip>.Success(skip);
        }

        public async Task<Response<List<Skip>>> GetAllSkips()
        {
            var skips = await _ssDbContext.Skips.Where(s => s.Deleted == false).ToListAsync();

            return Response<List<Skip>>.Success(skips);
        }
    }
}