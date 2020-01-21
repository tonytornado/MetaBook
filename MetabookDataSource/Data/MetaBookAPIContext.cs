using MetaBookDataSource.Data;
using Microsoft.EntityFrameworkCore;

namespace MetaBookDataSource.Models
{
    public class MetaBookAPIContext : DbContext
    {
        public MetaBookAPIContext(DbContextOptions<MetaBookAPIContext> options)
            : base(options)
        {
        }

        public MetaBookAPIContext()
        {
        }

        public DbSet<Person> People { get; set; }
        public DbSet<Address> Locations { get; set; }
        public DbSet<Phone> Phones { get; set; }
        public DbSet<Moment> Events { get; set; }
        public DbSet<MetaUser> UserBoxes { get; set; }
    }
}
