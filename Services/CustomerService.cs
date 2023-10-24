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
    }
}