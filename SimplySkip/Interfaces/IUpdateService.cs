using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface IUpdateService
    {
         Task<Response<Update>> CreateUpdate(Update update);

         Task<Response<List<Update>>> GetAllUpdates();
    }
}