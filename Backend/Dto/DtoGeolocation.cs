using Backend.Models;

namespace Backend.Dto;

public class DtoGeolocation(Guid userGuid, double latitude, double longitude)
{
    public Guid UserGuid { get; set; } = userGuid;
    public double Latitude { get; set; } = latitude;
    public double Longitude { get; set; } = longitude;

    public static explicit operator Geolocation(DtoGeolocation dto) =>
        new(dto.UserGuid, dto.Latitude, dto.Longitude);

    public static explicit operator DtoGeolocation(Geolocation location) =>
        new(location.UserGuid, location.Latitude, location.Longitude);
}