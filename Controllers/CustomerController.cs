using Microsoft.AspNetCore.Mvc;
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

        public async Task<ActionResult<Customer>> GetAll()
        {
            var response = await _customerService.GetAllCustomers();

            return Ok(response);
        }
    }
}