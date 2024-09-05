using Backend.Dto;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs;

public class GeolocationHub : Hub<IGeolocationClient>
{
    public override async Task OnConnectedAsync()
    {
        await Clients.All.RecieveGeolocation($"Thank you for connecting, {Context.ConnectionId}");
    }

    public void SendLocation(Geolocation location)
    {
        Console.Write($"Message from client {location.UserGuid}\nLatitude: {location.Latitude}\nLongitude: {location.Longitude}");
    }

    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }
}