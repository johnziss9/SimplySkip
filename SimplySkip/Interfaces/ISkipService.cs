using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface ISkipService
    {
        Task<Response<Skip>> CreateSkip(Skip skip);

        Task<Response<List<Skip>>> GetAllSkips();

        Task<Response<SkipPaginatedList<Skip>>> GetSkipsWithPagination(int page, int pageSize, string? filter = null);

        Task<Response<List<Skip>>> GetAvailableSkips();

        Task<Response<Skip>> GetSkipById(int id);

        Task<Response<Skip>> UpdateSkip(int id, Skip updatedSkip);
    }
}