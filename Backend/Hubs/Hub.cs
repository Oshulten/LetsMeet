using Backend.Database;
using Backend.Models;
using Backend.Dto;
using Microsoft.AspNetCore.SignalR;
using Backend.Services;
using System.Text.Json;

namespace Backend.Hubs;

public class Hub(LetsMeetDbContext db, HubPersistence persistence) : Hub<IHubClient>
{
    public override Task OnConnectedAsync()
    {
        if (Context.GetHttpContext() is HttpContext httpContext)
        {
            var username = httpContext.Request.Query["username"].ToString();
            var clerkId = httpContext.Request.Query["clerkId"].ToString();
            if (username is not null && clerkId is not null)
            {
                var user = new DtoUser(username, clerkId);
                var registeredUser = persistence.RegisterUser(Context.ConnectionId, user, db);
                Console.WriteLine($"Registered user {registeredUser.Username} on connectionId {Context.ConnectionId}");
                persistence.LogActiveUsers();
                Groups.AddToGroupAsync(Context.ConnectionId, username);
                Console.WriteLine(Groups.ToString());
            }
        }

        Console.WriteLine($"Established connection with id {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        persistence.DeregisterUserByConnectionId(Context.ConnectionId);
        Console.WriteLine($"Disconnected id {Context.ConnectionId}");
        return base.OnDisconnectedAsync(exception);
    }

    public async Task RequestMeeting(DtoMeeting meeting)
    {
        persistence.LogActiveUsers();
        var connectionId = persistence.ConnectionIdByUserId(meeting.TargetUser.ClerkId);
        Console.WriteLine($"Sending out meeting request to {meeting.TargetUser.Username} [{connectionId}]");
        await Clients.Client(connectionId).ReceiveMeetingRequest(meeting);
        Console.WriteLine($"{meeting.RequestUser.Username} wants to meet {meeting.TargetUser.Username}");
    }

    public async Task CancelMeeting(DtoMeeting meeting)
    {
        persistence.LogActiveUsers();
        var connectionId = persistence.ConnectionIdByUserId(meeting.TargetUser.ClerkId);
        Console.WriteLine($"Sending out meeting cancellation to {meeting.TargetUser.Username} [{connectionId}]");
        await Clients.Client(connectionId).ReceiveMeetingCancellation(meeting);
        Console.WriteLine($"{meeting.RequestUser.Username} cancels meeting with {meeting.TargetUser.Username}");
    }

    public async Task SendLocation(DtoGeolocation dto)
    {
        Console.WriteLine("SendLocation");
        var user = db.UserByClerkId(dto.ClerkId);

        if (user is null) Console.WriteLine("SendLocation: user is null");

        var location = db.AddGeolocation(dto);
        persistence.AddToLastLocations(dto.ClerkId, location);

        Console.WriteLine($"{user!.Username} ({Context.ConnectionId})\n\tLatitude: {dto.Lat}\n\tLongitude: {dto.Lng}");
        Console.WriteLine($"Connected users: {string.Join(", ", persistence.ActiveUsers.Select(user => user!.Username))}");
        await Clients.Others.ReceiveGeolocations(persistence.LastLocationPerUser);
    }

    public async Task ConfirmMeeting(DtoMeeting meeting)
    {
        var requestConnectionId = persistence.ConnectionIdByUserId(meeting.RequestUser.ClerkId);
        var targetConnectionId = persistence.ConnectionIdByUserId(meeting.TargetUser.ClerkId);

        await Clients.Client(requestConnectionId).ReceiveMeetingConfirmation(meeting);
        await Clients.Client(targetConnectionId).ReceiveMeetingConfirmation(meeting);

        Console.WriteLine($"Confirm meeting between {meeting.TargetUser.Username} and {meeting.RequestUser.Username}");
    }
}