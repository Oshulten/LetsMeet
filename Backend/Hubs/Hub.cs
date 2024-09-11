using Backend.Database;
using Backend.Models;
using Backend.Dto;
using Microsoft.AspNetCore.SignalR;
using Backend.Services;

namespace Backend.Hubs;

public class Hub(LetsMeetDbContext db, HubPersistence persistence) : Hub<IHubClient>
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine("\nOnConnectedAsync\n---");
        Console.WriteLine($"Established connection with id {Context.ConnectionId}");

        if (Context.GetHttpContext() is HttpContext httpContext)
        {
            var username = httpContext.Request.Query["username"].ToString();
            var clerkId = httpContext.Request.Query["clerkId"].ToString();

            if (username is not null && clerkId is not null)
            {
                var user = new DtoUser(username, clerkId);

                persistence.RegisterUser(Context.ConnectionId, user, db);
                persistence.LogRegisteredUsers();

                Console.WriteLine("---");

                return base.OnConnectedAsync();
            }
        }

        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine("\nOnDisconnectedAsync\n---");

        persistence.DeregisterUserByConnectionId(Context.ConnectionId);

        Console.WriteLine($"Disconnected id {Context.ConnectionId}");

        persistence.LogRegisteredUsers();

        Clients.All.ReceiveUserLocations(persistence.LastLocations);

        Console.WriteLine("---");

        return base.OnDisconnectedAsync(exception);
    }

    public async Task UpdateLocation(DtoUserLocation dto)
    {
        Console.WriteLine("\nSendLocation\n---");

        persistence.UpdateLastLocation(dto, db);
        persistence.LogRegisteredUsers();

        await Clients.All.ReceiveUserLocations(persistence.LastLocations);

        Console.WriteLine("---");
    }

    public async Task RequestMeeting(DtoMeeting meeting)
    {
        Console.WriteLine("\nRequestMeeting\n---");

        if (persistence.ConnectionIdByUser(meeting.TargetUser) is string targetConnectionId)
        {
            Console.WriteLine($"Sending out meeting request to {meeting.TargetUser.Username} [{targetConnectionId}]");

            await Clients.Client(targetConnectionId).ReceiveMeetingRequest(meeting);
            Console.WriteLine($"{meeting.RequestUser.Username} wants to meet {meeting.TargetUser.Username}");
        }

        Console.WriteLine("---");
    }

    public async Task CancelMeeting(DtoMeeting meeting)
    {
        Console.WriteLine("\nCancelMeeting\n---");

        if (persistence.ConnectionIdByUser(meeting.TargetUser) is string targetConnectionId)
        {
            Console.WriteLine($"Sending out meeting cancellation to {meeting.TargetUser.Username} [{targetConnectionId}]");
            await Clients.Client(targetConnectionId).ReceiveMeetingCancellation(meeting);
            Console.WriteLine($"{meeting.RequestUser.Username} cancels meeting with {meeting.TargetUser.Username}");
        }

        Console.WriteLine("---");
    }

    public async Task ConfirmMeeting(DtoMeeting meeting)
    {
        Console.WriteLine("\nConfirmMeeting\n---");

        var requestConnectionId = persistence.ConnectionIdByUser(meeting.RequestUser);
        var targetConnectionId = persistence.ConnectionIdByUser(meeting.TargetUser);

        if (requestConnectionId != null && targetConnectionId != null)
        {
            var meetingConfirmation = persistence.MeetingConfirmation(meeting);
            await Clients.Client(requestConnectionId).ReceiveMeetingConfirmation(meetingConfirmation);
            await Clients.Client(targetConnectionId).ReceiveMeetingConfirmation(meetingConfirmation);
            Console.WriteLine($"Confirm meeting between {meeting.TargetUser.Username} and {meeting.RequestUser.Username}");
        }

        Console.WriteLine("---");
    }
}