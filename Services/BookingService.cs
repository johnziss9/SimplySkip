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

            booking.Address = booking.Address.Replace(", ", "\n");

            return Response<Booking>.Success(booking);
        }

        public async Task<Response<List<Booking>>> GetAllBookings()
        {
            var bookings = await _ssDbContext.Bookings.ToListAsync();

            foreach (var booking in bookings)
                booking.Address = booking.Address.Replace(", ", "\n");

            return Response<List<Booking>>.Success(bookings);
        }

        public async Task<Response<List<Booking>>> GetCustomerBookings(int id)
        {
            var bookings = await _ssDbContext.Bookings.Where(b => b.CustomerId == id && b.Cancelled == false).ToListAsync();

            foreach (var booking in bookings)
                booking.Address = booking.Address.Replace(", ", "\n");

            return Response<List<Booking>>.Success(bookings);
        }

        public async Task<Response<Booking>> GetBookingById(int id)
        {
            var booking = await _ssDbContext.Bookings.Where(c => c.Id == id).FirstOrDefaultAsync();

            if (booking == null)
            {
                return Response<Booking>.Fail(404, "Booking Not Found");
            }

            booking.Address = booking.Address.Replace(", ", "\n");

            return Response<Booking>.Success(booking);
        }

        public async Task<Response<Booking>> GetBookingBySkipId(int id)
        {
            var booking = await _ssDbContext.Bookings.Where(c => c.SkipId == id).FirstOrDefaultAsync();

            if (booking == null)
            {
                return Response<Booking>.Fail(404, "Booking Not Found");
            }

            booking.Address = booking.Address.Replace(", ", "\n");

            return Response<Booking>.Success(booking);
        }

        public async Task<Response<Booking>> UpdateBooking(int id, Booking updatedBooking)
        {
            var booking = await _ssDbContext.Bookings.Where(c => c.Id == id).FirstOrDefaultAsync();

            if (booking == null)
            {
                return Response<Booking>.Fail(404, "Booking Not Found");
            }

            if (updatedBooking.SkipId != 0 && updatedBooking.SkipId != booking.SkipId)
            {
                booking.SkipId = updatedBooking.SkipId;
            }

            if (updatedBooking.Address != null && updatedBooking.Address != booking.Address)
            {
                booking.Address = updatedBooking.Address.Replace("\n", ", ");
            }

            if (updatedBooking.HireDate != booking.HireDate)
            {
                booking.HireDate = updatedBooking.HireDate;
            }

            if (updatedBooking.ReturnDate != booking.ReturnDate)
            {
                booking.ReturnDate = updatedBooking.ReturnDate;
            }

            if (updatedBooking.Notes != null && updatedBooking.Notes != booking.Notes)
            {
                booking.Notes = updatedBooking.Notes;
            }

            if (updatedBooking.Returned != booking.Returned)
            {
                booking.Returned = updatedBooking.Returned;
            }

            if (updatedBooking.Paid != booking.Paid)
            {
                booking.Paid = updatedBooking.Paid;
            }

            if (updatedBooking.Cancelled != booking.Cancelled)
            {
                booking.Cancelled = updatedBooking.Cancelled;
            }

            if (updatedBooking.CustomerId != 0 && updatedBooking.CustomerId != booking.CustomerId)
            {
                booking.CustomerId = updatedBooking.CustomerId;
            }

            await _ssDbContext.SaveChangesAsync();

            return Response<Booking>.Success(booking);
        }
    }
}