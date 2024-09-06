using Backend.Dto;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database
{
    public class LocationsDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<Geolocation> Locations { get; set; }
        public DbSet<User> Users { get; set; }

        public User? UserByClerkId(string clerkId) =>
            Users.FirstOrDefault(user => user.ClerkId == clerkId);

        public Geolocation AddGeolocation(DtoGeolocation dto)
        {
            var user = UserByClerkId(dto.ClerkId)
                ?? throw new Exception($"A user with clerkId of {dto.ClerkId} was not found");
            var geolocation = new Geolocation(user, dto.Latitude, dto.Longitude);
            user.Locations.Add(geolocation);
            Locations.Add(geolocation);
            SaveChanges();
            return geolocation;
        }

        public User AddUser(DtoUser dto)
        {
            var user = UserByClerkId(dto.ClerkId);
            if (user is null)
            {
                var newUser = new User(dto.Username, dto.ClerkId);
                Users.Add(newUser);
                SaveChanges();
                return newUser;
            }
            return user;
        }
    }
}