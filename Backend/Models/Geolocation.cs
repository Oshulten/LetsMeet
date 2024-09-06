using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class Geolocation(User user, double latitude, double longitude)
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public User User { get; set; } = user;
    public string UserId { get; set; } = user.Id;
    public double Latitude { get; set; } = latitude;
    public double Longitude { get; set; } = longitude;
    public DateTime Timestamp { get; set; } = DateTime.Now;

    public static Geolocation Null = new(User.Null, 0, 0);

    public Geolocation() : this(Null.User, Null.Latitude, Null.Longitude) { }
}