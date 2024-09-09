using Backend.Dto;
using Backend.Models;

namespace Backend.Hubs;

public interface IHubClient
{
    Task ReceiveGeolocations(List<DtoGeolocation> locations);
    Task ReceiveMeetingRequest(DtoMeeting meeting);
    Task ReceiveMeetingCancellation(DtoMeeting meeting);
    Task ReceiveMeetingConfirmation(DtoMeeting meeting);
}