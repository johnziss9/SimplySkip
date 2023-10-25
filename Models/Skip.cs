namespace SimplySkip.Models
{
    public class Skip
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public SkipSize SkipSize { get; set; }

        public string? Notes { get; set; }

        public bool Rented { get; set; } = false;

        public bool Deleted { get; set; } = false;
    }
}