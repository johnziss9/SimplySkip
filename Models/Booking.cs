namespace SimplySkip.Models
{
    public class Booking
    {
        public int Id { get; set; }

        public int SkipId { get; set; }

        public string? Address { get; set; }

        public DateTime HireDate { get; set; }

        public DateTime ReturnDate { get; set; }

        public string? Notes { get; set; }

        public bool Returned { get; set; }= false;

        public bool Paid { get; set; } = false;

        public bool Cancelled { get; set; } = false;

        public int CustomerId { get; set; }
    }
}