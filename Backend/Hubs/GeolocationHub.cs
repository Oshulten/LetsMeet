using Backend.Database;
using Backend.Models;
using Backend.Dto;
using Microsoft.AspNetCore.SignalR;
using Backend.Services;

namespace Backend.Hubs;

public class GeolocationHub(LetsMeetDbContext db, HubPersistence persistence) : Hub<IGeolocationClient>
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"Established connection with id {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"Disconnected id {Context.ConnectionId}");
        persistence.DeregisterUserByConnectionId(Context.ConnectionId);
        return base.OnDisconnectedAsync(exception);
    }

    public void RegisterUser(DtoUser user)
    {
        var registeredUser = persistence.RegisterUser(Context.ConnectionId, user, db);
        Console.WriteLine($"Registered user {registeredUser.Username}");
        persistence.LogActiveUsers();
    }

    public async Task RequestMeeting(DtoMeeting meeting)
    {
        var connectionId = persistence.ConnectionIdByUserId(meeting.TargetUser.ClerkId);
        await Clients.Client(connectionId).ReceiveMeetingRequest(meeting);
        Console.WriteLine($"{meeting.RequestUser.Username} wants to meet {meeting.TargetUser.Username}");
    }

    public async Task CancelMeeting(DtoMeeting meeting)
    {
        var connectionId = persistence.ConnectionIdByUserId(meeting.RequestUser.ClerkId);
        await Clients.Client(connectionId).RecieveMeetingCancellation(meeting);
        Console.WriteLine($"{meeting.RequestUser.Username} cancels meeting with {meeting.TargetUser.Username}");
    }

    public async Task SendLocation(DtoGeolocation dto)
    {
        var user = db.UserByClerkId(dto.ClerkId);

        var location = db.AddGeolocation(dto);
        persistence.AddToLastLocations(dto.ClerkId, location);

        Console.WriteLine($"{user!.Username} ({Context.ConnectionId})\n\tLatitude: {dto.Latitude}\n\tLongitude: {dto.Longitude}");
        Console.WriteLine($"Connected users: {string.Join(", ", persistence.ActiveUsers.Select(user => user!.Username))}");

        await Clients.All.RecieveGeolocations(persistence.LastLocationPerUser);
    }
}