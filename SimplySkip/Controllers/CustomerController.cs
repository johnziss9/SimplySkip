using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Customer>>> GetAll()
        {
            return ResponseHelper.HandleErrorAndReturn(await _customerService.GetAllCustomers());
        }

        [HttpGet("pagination")]
        public async Task<ActionResult<PaginatedList<Customer>>> GetPaginated([FromQuery] int page = 1, [FromQuery] string? search = null)
        {
            if (page < 1) page = 1;
            const int pageSize = 15;

            return ResponseHelper.HandleErrorAndReturn(await _customerService.GetCustomersWithPagination(page, pageSize, search));
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> Create(Customer customer)
        {
            return ResponseHelper.HandleErrorAndReturn(await _customerService.CreateCustomer(customer));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> Get(int id)
        {
            return ResponseHelper.HandleErrorAndReturn(await _customerService.GetCustomerById(id));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Customer>> Update(int id, Customer customer)
        {
            return ResponseHelper.HandleErrorAndReturn(await _customerService.UpdateCustomer(id, customer));
        }
    }
}