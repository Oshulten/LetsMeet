using Backend.Database;
using Backend.Models;
using Backend.Dto;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs;

public class GeolocationHub(LocationsDbContext context) : Hub<IGeolocationClient>
{
    public async Task SendLocation(Geolocation geolocation)
    {
        Console.Write($"\nMessage from client {geolocation.UserGuid}\nLatitude: {geolocation.Latitude}\nLongitude: {geolocation.Longitude}");
        context.Locations.Add(geolocation);
        context.SaveChanges();

        var groupsByUserGuid = context.Locations.GroupBy(location => location.UserGuid);

        var dtos = new List<DtoGeolocation>();

        foreach (var grouping in groupsByUserGuid)
        {
            dtos.Add((DtoGeolocation)grouping.OrderByDescending(location => location.Timestamp).First());
        }

        await Clients.All.RecieveGeolocations(dtos);
    }

    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }
}