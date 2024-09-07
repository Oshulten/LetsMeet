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
        return Task.CompletedTask;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"Disconnected id {Context.ConnectionId}");
        persistence.DeregisterUserByConnectionId(Context.ConnectionId);
        return Task.CompletedTask;
    }

    public void RegisterUser(DtoUser user)
    {
        var registeredUser = persistence.RegisterUser(Context.ConnectionId, user, db);
        Console.WriteLine($"Registered user {registeredUser.Username}");
        persistence.LogActiveUsers();
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