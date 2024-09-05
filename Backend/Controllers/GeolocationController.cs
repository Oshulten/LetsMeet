using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Backend.Dto;
using Backend.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GeolocationController(IHubContext<GeolocationHub, IGeolocationClient> _hubContext) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostLocation(Geolocation location)
    {
        var serializedLocation = JsonSerializer.Serialize<Geolocation>(location);
        Console.WriteLine($"Latitude: {location.Latitude}, Longitude: {location.Longitude}");
        await _hubContext.Clients.All.RecieveGeolocation(serializedLocation);
        return Ok();
    }
}

