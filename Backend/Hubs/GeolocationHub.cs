using Backend.Database;
using Backend.Models;
using Backend.Dto;
using Microsoft.AspNetCore.SignalR;
using Backend.Services;

namespace Backend.Hubs;

public class GeolocationHub(HubPersistence persistence) : Hub<IGeolocationClient>
{
    public async Task SendLocation(Geolocation geolocation)
    {
        Console.Write($"\nMessage from client {geolocation.UserGuid}\nLatitude: {geolocation.Latitude}\nLongitude: {geolocation.Longitude}");
        persistence.AddToLastLocations(Context.ConnectionId, geolocation);
        await Clients.All.RecieveGeolocations(persistence.LastLocationPerUser);
    }
}