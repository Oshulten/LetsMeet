using Backend.Models;

namespace Backend.Dto;

public class DtoGeolocation(string clerkId, string username, double lat, double lng)
{
    public string ClerkId { get; set; } = clerkId;
    public string Username { get; set; } = username;
    public double Lat { get; set; } = lat;
    public double Lng { get; set; } = lng;

    public static explicit operator DtoGeolocation(Geolocation dto) =>
        new(dto.User.Id, dto.User.Username, dto.Latitude, dto.Longitude);
}