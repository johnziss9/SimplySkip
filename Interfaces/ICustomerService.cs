
using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface ICustomerService
    {
        Task<Response<List<Customer>>> GetAllCustomers();

        Task<Response<Customer>> CreateCustomer(Customer customer);
    }
}