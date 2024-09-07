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

        var location = db.AddGeolocation(dto);
        persistence.AddToLastLocations(dto.ClerkId, location);

        Console.WriteLine($"{user!.Username}\n\tLatitude: {dto.Latitude}\n\tLongitude: {dto.Longitude}");
        Console.WriteLine($"Connected users: {string.Join(", ", persistence.ActiveUsers(db).Select(user => user!.Username))}");

        await Clients.All.RecieveGeolocations(persistence.LastLocationPerUser);
    }
}