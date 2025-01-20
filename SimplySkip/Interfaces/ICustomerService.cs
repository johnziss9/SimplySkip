
using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface ICustomerService
    {
        Task<Response<List<Customer>>> GetAllCustomers();

        Task<Response<PaginatedList<Customer>>> GetCustomersWithPagination(int page, int pageSize, string? searchQuery = null);

        Task<Response<Customer>> CreateCustomer(Customer customer);

        Task<Response<Customer>> GetCustomerById(int id);

        Task<Response<Customer>> UpdateCustomer(int id, Customer updatedCustomer);
    }
}