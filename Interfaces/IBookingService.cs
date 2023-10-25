using SimplySkip.Helpers;
using SimplySkip.Models;

namespace SimplySkip.Interfaces
{
    public interface IBookingService
    {
        Task<Response<Booking>> CreateBooking(Booking booking);
    }
}