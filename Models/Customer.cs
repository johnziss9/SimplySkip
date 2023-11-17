using System.ComponentModel.DataAnnotations;

namespace SimplySkip.Models
{
    public class Customer
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "First Name is required.")]
        public string? FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required.")]
        public string? LastName { get; set; }

        public string? Address { get; set; }
        
        [Required(ErrorMessage = "Phone is required.")]
        public string? Phone { get; set; }

        public string? Email { get; set; }

        public bool Deleted { get; set; } = false;
    }
}