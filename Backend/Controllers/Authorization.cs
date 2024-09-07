using Backend.Database;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Authorization(LetsMeetDbContext db) : ControllerBase
{
    [HttpPost("ensure-created")]
    public IActionResult EnsureUserIsCreated(DtoUser dto)
    {
        db.AddUser(dto);
        Console.WriteLine($"Ensured user {dto.Username} exists");
        return Ok();
    }
}