using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface ISkipService
    {
        Task<Response<Skip>> AddSkip(Skip skip);

        Task<Response<List<Skip>>> GetAllSkips();

        Task<Response<Skip>> GetSkipById(int id);

        Task<Response<Skip>> DeleteSkip(int id, Skip updatedSkip);
    }
}