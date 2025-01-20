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

            if (booking.Address != null)
                booking.Address = booking.Address.Replace(", ", "\n");

            if (booking.Notes != null)
                booking.Notes = booking.Notes.Replace(", ", "\n");

            return Response<Booking>.Success(booking);
        }

        public async Task<Response<List<Booking>>> GetAllBookings()
        {
            var bookings = await _ssDbContext.Bookings.ToListAsync();

            foreach (var booking in bookings)
            {

                if (booking.Address != null)
                    booking.Address = booking.Address.Replace(", ", "\n");

                if (booking.Notes != null)
                    booking.Notes = booking.Notes.Replace(", ", "\n");
            }

            return Response<List<Booking>>.Success(bookings);
        }

        public async Task<Response<PaginatedList<Booking>>> GetBookingsWithPagination(int page, int pageSize, string? filter = null)
        {
            try
            {
                var query = _ssDbContext.Bookings.AsQueryable();

                // Apply filters
                switch (filter?.ToLower())
                {
                    case "active":
                        query = query.Where(b => !b.Returned && !b.Cancelled);
                        break;
                    case "unpaid":
                        query = query.Where(b => b.Returned && !b.Paid && !b.Cancelled);
                        break;
                    case "past":
                        query = query.Where(b => b.Returned && b.Paid && !b.Cancelled);
                        break;
                    case "cancelled":
                        query = query.Where(b => b.Cancelled);
                        break;
                    default: // "all" or null
                        break;
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Calculate pagination values
                var skip = (page - 1) * pageSize;

                // Get paginated data
                var bookings = await query
                    .OrderByDescending(b => b.CreatedOn)
                    .Skip(skip)
                    .Take(pageSize)
                    .ToListAsync();

                // Format addresses
                foreach (var booking in bookings)
                {
                    if (booking.Address != null)
                        booking.Address = booking.Address.Replace(", ", "\n");
                }

                var paginatedList = new PaginatedList<Booking>(
                    bookings,
                    totalCount,
                    pageSize,
                    page
                );

                return Response<PaginatedList<Booking>>.Success(paginatedList);
            }
            catch (Exception ex)
            {
                return Response<PaginatedList<Booking>>.Fail(ex);
            }
        }

        public async Task<Response<List<Booking>>> GetBookingsByCustomerId(int id)
        {
            var bookings = await _ssDbContext.Bookings.Where(b => b.CustomerId == id).ToListAsync();

            foreach (var booking in bookings)
            {

                if (booking.Address != null)
                    booking.Address = booking.Address.Replace(", ", "\n");

                if (booking.Notes != null)
                    booking.Notes = booking.Notes.Replace(", ", "\n");
            }

            return Response<List<Booking>>.Success(bookings);
        }

        public async Task<Response<Booking>> GetBookingById(int id)
        {
            var booking = await _ssDbContext.Bookings.Where(c => c.Id == id).FirstOrDefaultAsync();

            if (booking == null)
            {
                return Response<Booking>.Fail(404, "Booking Not Found");
            }

            if (booking.Address != null)
                booking.Address = booking.Address.Replace(", ", "\n");

            if (booking.Notes != null)
                booking.Notes = booking.Notes.Replace(", ", "\n");

            return Response<Booking>.Success(booking);
        }

        public async Task<Response<Booking>> GetBookingBySkipId(int id)
        {
            var booking = await _ssDbContext.Bookings.Where(c => c.SkipId == id).FirstOrDefaultAsync();

            if (booking == null)
            {
                return Response<Booking>.Fail(404, "Booking Not Found");
            }

            if (booking.Address != null)
                booking.Address = booking.Address.Replace(", ", "\n");

            if (booking.Notes != null)
                booking.Notes = booking.Notes.Replace(", ", "\n");

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
                booking.Notes = updatedBooking.Notes.Replace("\n", ", ");
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

            if (updatedBooking.LastUpdated != booking.LastUpdated)
            {
                booking.LastUpdated = updatedBooking.LastUpdated;
            }

            if (updatedBooking.CancelledOn != booking.CancelledOn)
            {
                booking.CancelledOn = updatedBooking.CancelledOn;
            }

            await _ssDbContext.SaveChangesAsync();

            return Response<Booking>.Success(booking);
        }
    }
}