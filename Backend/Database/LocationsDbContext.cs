using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database
{
    public class LocationsDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<Geolocation> Locations { get; set; }
    }
}