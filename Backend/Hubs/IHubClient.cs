using Backend.Dto;
using Backend.Models;

namespace Backend.Hubs;

public interface IHubClient
{
    Task ReceiveUserLocations(List<DtoUserLocation> locations);
    Task ReceiveMeetingRequest(DtoMeeting meeting);
    Task ReceiveMeetingCancellation(DtoMeeting meeting);
    Task ReceiveMeetingConfirmation(DtoMeeting meeting);
}