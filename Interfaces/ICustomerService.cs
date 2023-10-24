
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface ICustomerService
    {
        Task<List<Customer>> GetAllCustomers();
    }
}