using Backend.Dto;
using Backend.Models;

namespace Backend.Hubs;

public interface IGeolocationClient
{
    Task RecieveGeolocations(List<DtoGeolocation> locations);
    Task ReceiveWantMeeting(DtoMeeting meeting);
    Task ReceiveCancelMeeting(DtoMeeting meeting);
}