using Backend.Models;

namespace Backend.Dto;

public class DtoMeeting(DtoUser requestUser, DtoUser targetUser)
{
    public DtoUser RequestUser { get; set; } = requestUser;
    public DtoUser TargetUser { get; set; } = targetUser;
}