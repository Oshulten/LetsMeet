using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs;

public class NotificationHub : Hub<INotificationClient>
{
    public override async Task OnConnectedAsync()
    {
        await Clients.All.ReceiveNotification($"Thank you for connecting, {Context.ConnectionId}");
    }

    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }

}