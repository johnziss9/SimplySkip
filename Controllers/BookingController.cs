using Microsoft.AspNetCore.Mvc;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> Create(Booking booking)
        {
            return ResponseHelper.HandleErrorAndReturn(await _bookingService.CreateBooking(booking));
        }

        [HttpGet]
        public async Task<ActionResult<List<Booking>>> GetAll()
        {
            return ResponseHelper.HandleErrorAndReturn(await _bookingService.GetAllBookings());
        }
    }
}