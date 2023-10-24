using Microsoft.EntityFrameworkCore;
using SimplySkip.Models;

namespace SimplySkip
{
    public class SSDbContext : DbContext
    {
        public SSDbContext(DbContextOptions<SSDbContext> options)
        : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Booking> Bookings { get; set; }
    }
}