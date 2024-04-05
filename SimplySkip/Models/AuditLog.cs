namespace SimplySkip.Models
{
    public class AuditLog
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string? Username { get; set; }
        
        public string? Action { get; set; }
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}