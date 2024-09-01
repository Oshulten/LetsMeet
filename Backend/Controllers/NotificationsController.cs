using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController(IHubContext<NotificationHub, INotificationClient> _hubContext) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Post(Notification notification)
    {
        await _hubContext.Clients.All.ReceiveNotification($"-> {notification.Message}");
        return Ok();
    }
}

public class Notification
{
    public int UserId { get; set; }
    public string Message { get; set; } = string.Empty;
}