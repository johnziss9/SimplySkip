using System.ComponentModel.DataAnnotations;
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
            var customers = await _ssDbContext.Customers.Where(c => c.Deleted == false).ToListAsync();

            foreach (var customer in customers)
            {
                if (customer.Address != null)
                    customer.Address = customer.Address.Replace(", ", "\n");
            }

            return Response<List<Customer>>.Success(customers);
        }

        public async Task<Response<PaginatedList<Customer>>> GetCustomersWithPagination(int page, int pageSize, string? searchQuery = null)
        {
            try
            {
                var query = _ssDbContext.Customers.Where(c => c.Deleted == false);

                // Apply search filter if searchQuery is provided
                if (!string.IsNullOrWhiteSpace(searchQuery))
                {
                    searchQuery = searchQuery.ToLower();
                    query = query.Where(c =>
                        (c.FirstName ?? "").ToLower().Contains(searchQuery) ||
                        (c.LastName ?? "").ToLower().Contains(searchQuery) ||
                        (c.Phone ?? "").ToLower().Contains(searchQuery)
                    );
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Calculate pagination values
                var skip = (page - 1) * pageSize;

                // Get paginated data
                var customers = await query
                    .OrderByDescending(c => c.CreatedOn)
                    .Skip(skip)
                    .Take(pageSize)
                    .ToListAsync();

                // Format addresses
                foreach (var customer in customers)
                {
                    if (customer.Address != null)
                        customer.Address = customer.Address.Replace(", ", "\n");
                }

                var paginatedList = new PaginatedList<Customer>(
                    customers,
                    totalCount,
                    pageSize,
                    page
                );

                return Response<PaginatedList<Customer>>.Success(paginatedList);
            }
            catch (Exception ex)
            {
                return Response<PaginatedList<Customer>>.Fail(ex);
            }
        }

        public async Task<Response<Customer>> CreateCustomer(Customer customer)
        {
            // Validate customer object for required fields and other validations
            var validationContext = new ValidationContext(customer, serviceProvider: null, items: null);
            var validationResults = new List<ValidationResult>();

            if (!Validator.TryValidateObject(customer, validationContext, validationResults, validateAllProperties: true))
            {
                var errorMessages = validationResults.Select(vr => vr.ErrorMessage).ToList();
                return Response<Customer>.Fail(errorMessages);
            }

            if (_ssDbContext.Customers.Any(c => c.Phone == customer.Phone))
            {
                return Response<Customer>.Fail(400, "Customer with this phone number already exists");
            }

            _ssDbContext.Customers.Add(customer);
            await _ssDbContext.SaveChangesAsync();

            if (customer.Address != null)
                customer.Address = customer.Address.Replace(", ", "\n");

            return Response<Customer>.Success(customer);
        }

        public async Task<Response<Customer>> GetCustomerById(int id)
        {
            var customer = await _ssDbContext.Customers.Where(c => c.Id == id).FirstOrDefaultAsync();

            if (customer == null)
            {
                return Response<Customer>.Fail(404, "Customer Not Found");
            }

            if (customer.Address != null)
                customer.Address = customer.Address.Replace(", ", "\n");

            return Response<Customer>.Success(customer);
        }

        public async Task<Response<Customer>> UpdateCustomer(int id, Customer updatedCustomer)
        {
            var customer = await _ssDbContext.Customers.Where(c => c.Id == id).FirstOrDefaultAsync();

            if (customer == null)
            {
                return Response<Customer>.Fail(404, "Customer Not Found");
            }

            if (updatedCustomer.FirstName != null && updatedCustomer.FirstName != customer.FirstName)
            {
                customer.FirstName = updatedCustomer.FirstName;
            }

            if (updatedCustomer.LastName != null && updatedCustomer.LastName != customer.LastName)
            {
                customer.LastName = updatedCustomer.LastName;
            }

            if (updatedCustomer.Address != null && updatedCustomer.Address != customer.Address)
            {
                customer.Address = updatedCustomer.Address.Replace("\n", ", ");
            }

            if (updatedCustomer.Phone != null && updatedCustomer.Phone != customer.Phone)
            {
                customer.Phone = updatedCustomer.Phone;
            }

            if (updatedCustomer.Email != null && updatedCustomer.Email != customer.Email)
            {
                customer.Email = updatedCustomer.Email;
            }

            if (updatedCustomer.Deleted != customer.Deleted)
            {
                customer.Deleted = updatedCustomer.Deleted;
            }

            if (updatedCustomer.LastUpdated != customer.LastUpdated)
            {
                customer.LastUpdated = updatedCustomer.LastUpdated;
            }

            if (updatedCustomer.DeletedOn != customer.DeletedOn)
            {
                customer.DeletedOn = updatedCustomer.DeletedOn;
            }

            await _ssDbContext.SaveChangesAsync();

            return Response<Customer>.Success(customer);
        }
    }
}