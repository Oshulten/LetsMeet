using Backend.Dto;
using Backend.Models;

namespace Backend.Hubs;

public interface IGeolocationClient
{
    Task RecieveGeolocations(List<DtoGeolocation> locations);
    Task ReceiveMeetingRequest(DtoMeeting meeting);
    Task RecieveMeetingCancellation(DtoMeeting meeting);
}