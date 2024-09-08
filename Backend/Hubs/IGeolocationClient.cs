using Backend.Dto;
using Backend.Models;

namespace Backend.Hubs;

public interface IGeolocationClient
{
    Task ReceiveGeolocations(List<DtoGeolocation> locations);
    Task ReceiveMeetingRequest(DtoMeeting meeting);
    Task ReceiveMeetingCancellation(DtoMeeting meeting);
}