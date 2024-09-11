using Backend.Models;

namespace Backend.Dto;

public class DtoMeetingConfirmation(List<DtoUserLocation> participants)
{
    public List<DtoUserLocation> Participants { get; set; } = participants;
}