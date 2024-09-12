using Backend.Models;

namespace Backend.Dto;

public class DtoUserLocation(DtoUser user, LatLng location)
{
    public DtoUser User { get; set; } = user;
    public LatLng Location { get; set; } = location;

    public static explicit operator DtoUserLocation(UserLocation userLocation) =>
        new((DtoUser)userLocation.User, new LatLng(userLocation.Lat, userLocation.Lng));
}