using Backend.Dto;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database
{
    public class LetsMeetDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<UserLocation> Locations { get; set; }
        public DbSet<User> Users { get; set; }

        public User? UserByClerkId(string clerkId) =>
            Users.Find(clerkId);

        public UserLocation AddGeolocation(DtoUserLocation dto)
        {
            var user = Users.Find(dto.User.Id)
                ?? throw new Exception($"A user with id of {dto.User.Id} was not found");

            var geolocation = new UserLocation(user, dto.Location);

            user.Locations.Add(geolocation);
            Locations.Add(geolocation);
            SaveChanges();
            
            return geolocation;
        }

        public User AddUser(DtoUser dto)
        {
            var user = Users.Find(dto.Id);

            if (user is null)
            {
                var newUser = new User(dto.Username, dto.Id);
                Users.Add(newUser);
                SaveChanges();
                return newUser;
            }

            return user;
        }
    }
}