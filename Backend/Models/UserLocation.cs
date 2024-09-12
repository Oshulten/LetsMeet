using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class UserLocation(User user, LatLng location)
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public User User { get; set; } = user;
    public string UserId { get; set; } = user.Id;
    public double Lat { get; set; } = location.Lat;
    public double Lng { get; set; } = location.Lng;
    public DateTime Timestamp { get; set; } = DateTime.Now;

    public static readonly UserLocation Null = new();

    public UserLocation() : this(Null.User, LatLng.Null) { }
}