namespace SimplySkip.Models
{
    public class Update
    {
        public int Id { get; set; }

        public DateTime Timestamp { get; set; }

        public required string Title { get; set; }

        public required string Updates { get; set; }
    }
}