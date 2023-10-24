using Microsoft.EntityFrameworkCore;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly SSDbContext _ssDbContext;

        public CustomerService(SSDbContext ssDbContext)
        {
            _ssDbContext = ssDbContext;
        }
        public async Task<Response<List<Customer>>> GetAllCustomers()
        {
            var customers = await _ssDbContext.Customers.ToListAsync();

            return Response<List<Customer>>.Success(customers);
        }

        public async Task<Response<Customer>> CreateCustomer(Customer customer)
        {
            _ssDbContext.Customers.Add(customer);
            await _ssDbContext.SaveChangesAsync();

            return Response<Customer>.Success(customer);
        }
    }
}