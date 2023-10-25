using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface ISkipService
    {
         Task<Response<Skip>> CreateCustomer(Skip skip);
    }
}