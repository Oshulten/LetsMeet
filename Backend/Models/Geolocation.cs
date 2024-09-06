using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models;

public class Geolocation(Guid userGuid, double latitude, double longitude)
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserGuid { get; set; } = userGuid;
    public double Latitude { get; set; } = latitude;
    public double Longitude { get; set; } = longitude;
    public DateTime Timestamp { get; set; } = DateTime.Now;
}