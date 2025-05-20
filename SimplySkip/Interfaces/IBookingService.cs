using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface IBookingService
    {
        Task<Response<Booking>> CreateBooking(Booking booking);

        Task<Response<List<Booking>>> GetAllBookings();

        Task<Response<BookingPaginatedList<Booking>>> GetBookingsWithPagination(int page, int pageSize, string? filter = null);

        Task<Response<List<Booking>>> GetBookingsByCustomerId(int id);

        Task<Response<Booking>> GetBookingById(int id);

        Task<Response<Booking>> GetActiveBookingBySkipId(int id);

        Task<Response<List<AddressCountDto>>> GetAddressesWithCountsByCustomerId(int customerId);

        Task<Response<Booking>> UpdateBooking(int id, Booking updatedBooking);
    }
}