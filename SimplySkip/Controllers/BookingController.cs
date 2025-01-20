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

        [HttpGet("pagination")]
        public async Task<ActionResult<PaginatedList<Booking>>> GetPaginated([FromQuery] int page = 1, [FromQuery] string? filter = null)
        {
            if (page < 1) page = 1;
            const int pageSize = 15;

            return ResponseHelper.HandleErrorAndReturn(await _bookingService.GetBookingsWithPagination(page, pageSize, filter));
        }

        [HttpGet("customer/{id}")]
        public async Task<ActionResult<List<Booking>>> GetByCustomerId(int id)
        {
            return ResponseHelper.HandleErrorAndReturn(await _bookingService.GetBookingsByCustomerId(id));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> Get(int id)
        {
            return ResponseHelper.HandleErrorAndReturn(await _bookingService.GetBookingById(id));
        }

        [HttpGet("skip/{id}")]
        public async Task<ActionResult<Booking>> GetBySkipId(int id)
        {
            return ResponseHelper.HandleErrorAndReturn(await _bookingService.GetBookingBySkipId(id));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Booking>> Update(int id, Booking booking)
        {
            return ResponseHelper.HandleErrorAndReturn(await _bookingService.UpdateBooking(id, booking));
        }
    }
}