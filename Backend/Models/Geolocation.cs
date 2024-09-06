using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class Geolocation(User user, double latitude, double longitude)
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public User User { get; set; } = user;
    public Guid UserId { get; set; }
    public double Latitude { get; set; } = latitude;
    public double Longitude { get; set; } = longitude;
    public DateTime Timestamp { get; set; } = DateTime.Now;

    public static Geolocation Null = new Geolocation(User.Null, 0, 0);

    public Geolocation() : this(Null.User, Null.Latitude, Null.Longitude) { }
}