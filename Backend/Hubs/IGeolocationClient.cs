using Backend.Dto;

namespace Backend.Hubs;

public interface IGeolocationClient
{
    Task RecieveGeolocations(List<DtoGeolocation> locations);

}