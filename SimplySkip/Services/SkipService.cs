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

        public async Task<Response<Skip>> CreateSkip(Skip skip)
        {
            _ssDbContext.Skips.Add(skip);
            await _ssDbContext.SaveChangesAsync();

            if (skip.Notes != null)
                skip.Notes = skip.Notes.Replace(", ", "\n");

            return Response<Skip>.Success(skip);
        }

        public async Task<Response<List<Skip>>> GetAllSkips()
        {
            var skips = await _ssDbContext.Skips.Where(s => s.Deleted == false).ToListAsync();

            foreach (var skip in skips)
            {
                if (skip.Notes != null)
                    skip.Notes = skip.Notes.Replace(", ", "\n");
            }

            return Response<List<Skip>>.Success(skips);
        }

        public async Task<Response<List<Skip>>> GetAvailableSkips()
        {
            var skips = await _ssDbContext.Skips.Where(s => s.Deleted == false && s.Rented == false).ToListAsync();

            foreach (var skip in skips)
            {
                if (skip.Notes != null)
                    skip.Notes = skip.Notes.Replace(", ", "\n");
            }

            return Response<List<Skip>>.Success(skips);
        }

        public async Task<Response<Skip>> GetSkipById(int id)
        {
            var skip = await _ssDbContext.Skips.Where(s => s.Id == id).FirstOrDefaultAsync();

            if (skip == null)
            {
                return Response<Skip>.Fail(404, "Skip Not Found");
            }

            if (skip.Notes != null)
                skip.Notes = skip.Notes.Replace(", ", "\n");

            return Response<Skip>.Success(skip);
        }

        public async Task<Response<Skip>> UpdateSkip(int id, Skip updatedSkip)
        {
            var skip = await _ssDbContext.Skips.Where(s => s.Id == id).FirstOrDefaultAsync();

            if (skip == null)
            {
                return Response<Skip>.Fail(404, "Skip Not Found");
            }

            if (updatedSkip.Notes != null && updatedSkip.Notes != skip.Notes)
            {
                skip.Notes = updatedSkip.Notes.Replace("\n", ", ");
            }

            if (updatedSkip.Rented != skip.Rented)
            {
                skip.Rented = updatedSkip.Rented;
            }

            if (updatedSkip.Deleted != skip.Deleted)
            {
                skip.Deleted = updatedSkip.Deleted;
            }

            if (updatedSkip.LastUpdated != skip.LastUpdated)
            {
                skip.LastUpdated = updatedSkip.LastUpdated;
            }

            if (updatedSkip.DeletedOn != skip.DeletedOn)
            {
                skip.DeletedOn = updatedSkip.DeletedOn;
            }

            await _ssDbContext.SaveChangesAsync();

            return Response<Skip>.Success(skip);
        }
    }
}