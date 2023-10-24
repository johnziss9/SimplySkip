using Microsoft.AspNetCore.Mvc;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Controllers
{
    [ApiController]
    [Route("[controller]")]
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

        [HttpPost]
        public async Task<ActionResult<Customer>> Create(Customer customer)
        {
            return ResponseHelper.HandleErrorAndReturn(await _customerService.CreateCustomer(customer));
        }
    }
}