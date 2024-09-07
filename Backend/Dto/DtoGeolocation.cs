using Backend.Models;

namespace Backend.Dto;

public class DtoGeolocation(string clerkId, string username, double latitude, double longitude)
{
    public string ClerkId { get; set; } = clerkId;
    public string Username { get; set; } = username;
    public double Latitude { get; set; } = latitude;
    public double Longitude { get; set; } = longitude;

    public static explicit operator DtoGeolocation(Geolocation dto) =>
        new(dto.User.Id, dto.User.Username, dto.Latitude, dto.Longitude);
}