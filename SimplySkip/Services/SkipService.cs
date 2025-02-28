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

        public async Task<Response<SkipPaginatedList<Skip>>> GetSkipsWithPagination(int page, int pageSize, string? filter = null)
        {
            try
            {
                var counts = new SkipCounts
                {
                    All = await _ssDbContext.Skips.CountAsync(s => !s.Deleted),
                    Rented = await _ssDbContext.Skips.CountAsync(s => s.Rented && !s.Deleted),
                    Available = await _ssDbContext.Skips.CountAsync(s => !s.Rented && !s.Deleted)
                };

                var query = _ssDbContext.Skips.AsQueryable();
                query = query.Where(s => !s.Deleted);

                // Apply filters
                switch (filter?.ToLower())
                {
                    case "booked":
                        query = query.Where(s => s.Rented);
                        break;
                    case "available":
                        query = query.Where(s => !s.Rented);
                        break;
                    default: // "all" or null
                        break;
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Calculate pagination values
                var skip = (page - 1) * pageSize;

                // Get paginated data
                var skips = await query
                    .OrderByDescending(s => s.CreatedOn)
                    .Skip(skip)
                    .Take(pageSize)
                    .ToListAsync();

                var skipPaginatedList = new SkipPaginatedList<Skip>(
                    skips,
                    totalCount,
                    pageSize,
                    page,
                    counts
                );

                return Response<SkipPaginatedList<Skip>>.Success(skipPaginatedList);
            }
            catch (Exception ex)
            {
                return Response<SkipPaginatedList<Skip>>.Fail(ex);
            }
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