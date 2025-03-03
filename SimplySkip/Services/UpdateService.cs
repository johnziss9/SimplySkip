using Microsoft.EntityFrameworkCore;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Services
{
    public class UpdateService : IUpdateService
    {
        private readonly SSDbContext _ssDbContext;

        public UpdateService(SSDbContext ssDbContext)
        {
            _ssDbContext = ssDbContext;
        }

        public async Task<Response<Update>> CreateUpdate(Update update)
        {
            _ssDbContext.Updates.Add(update);
            await _ssDbContext.SaveChangesAsync();

            return Response<Update>.Success(update);
        }

        public async Task<Response<List<Update>>> GetAllUpdates()
        {
            var updates = await _ssDbContext.Updates.ToListAsync();

            return Response<List<Update>>.Success(updates);
        }
    }
}