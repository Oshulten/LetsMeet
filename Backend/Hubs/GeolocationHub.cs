using Backend.Database;
using Backend.Models;
using Backend.Dto;
using Microsoft.AspNetCore.SignalR;
using Backend.Services;

namespace Backend.Hubs;

public class GeolocationHub(LetsMeetDbContext db, HubPersistence persistence) : Hub<IGeolocationClient>
{
    public async Task SendLocation(DtoGeolocation dto)
    {
        var user = db.UserByClerkId(dto.ClerkId);

        Console.WriteLine($"{user!.Username}\n\tLatitude: {dto.Latitude}\n\tLongitude: {dto.Longitude}");
        Console.WriteLine($"Connected users: {string.Join(", ", persistence.ActiveUsers.Select(user => user!.Username))}");

        var location = db.AddGeolocation(dto);
        persistence.AddToLastLocations(dto.ClerkId, location);
        await Clients.All.RecieveGeolocations(persistence.LastLocationPerUser);
    }
}