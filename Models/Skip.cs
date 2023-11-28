using System.ComponentModel.DataAnnotations;

namespace SimplySkip.Models
{
    public class Skip
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Skip Name is required.")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Skip Size is required.")]
        [EnumDataType(typeof(SkipSize), ErrorMessage = "Invalid Skip Size.")]
        public SkipSize Size { get; set; }

        public string? Notes { get; set; }

        public bool Rented { get; set; } = false;

        public bool Deleted { get; set; } = false;
    }
}