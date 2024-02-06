using System.ComponentModel.DataAnnotations;

namespace SimplySkip.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Skip is required.")]
        public int SkipId { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        public string? Address { get; set; }

        public DateTime HireDate { get; set; }

        public DateTime ReturnDate { get; set; }

        public string? Notes { get; set; }

        public bool Returned { get; set; }= false;

        public bool Paid { get; set; } = false;

        public bool Cancelled { get; set; } = false;

        [Required(ErrorMessage = "Customer is required.")]

        public int CustomerId { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime LastUpdated { get; set; }

        public DateTime CancelledOn { get; set; }
    }
}