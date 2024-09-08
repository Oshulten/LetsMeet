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

    public async Task WantsToMeet(string clerkId)
    {
        var user = db.UserByClerkId(clerkId);
        var connectionId = persistence.ConnectionIdByUserId(clerkId);
        await Clients.Client(connectionId).ReceiveWantMeeting((DtoUser)user!);
    }

    public async Task CancelWantsToMeet(string clerkId)
    {
        var user = db.UserByClerkId(clerkId);
        var connectionId = persistence.ConnectionIdByUserId(clerkId);
        await Clients.Client(connectionId).ReceiveCancelMeeting((DtoUser)user!);
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