using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs;

public class NotificationHub : Hub<IGeolocationClient>
{
    public override async Task OnConnectedAsync()
    {
        await Clients.All.RecieveGeolocation($"Thank you for connecting, {Context.ConnectionId}");
    }

    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }
}