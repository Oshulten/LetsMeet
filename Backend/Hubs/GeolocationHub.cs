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
        Console.Write($"\nMessage from user {user!.Username}\nLatitude: {dto.Latitude}\nLongitude: {dto.Longitude}");
        var location = db.AddGeolocation(dto);
        persistence.AddToLastLocations(dto.ClerkId, location);
        await Clients.All.RecieveGeolocations(persistence.LastLocationPerUser);
    }
}