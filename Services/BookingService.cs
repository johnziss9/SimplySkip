using Microsoft.EntityFrameworkCore;
using SimplySkip.Helpers;
using SimplySkip.Interfaces;
using SimplySkip.Models;

namespace SimplySkip.Services
{
    public class BookingService : IBookingService
    {
        private readonly SSDbContext _ssDbContext;

        public BookingService(SSDbContext sSDbContext)
        {
            _ssDbContext = sSDbContext;
        }
        public async Task<Response<Booking>> CreateBooking(Booking booking)
        {
            _ssDbContext.Bookings.Add(booking);
            await _ssDbContext.SaveChangesAsync();

            return Response<Booking>.Success(booking);
        }

        public async Task<Response<List<Booking>>> GetAllBookings()
        {
            var bookings = await _ssDbContext.Bookings.ToListAsync();

            return Response<List<Booking>>.Success(bookings);
        }
    }
}