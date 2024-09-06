using Backend.Database;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Authorization(LocationsDbContext db) : ControllerBase
{
    [HttpPost("ensure-created")]
    public IActionResult EnsureUserIsCreated(DtoUser dto)
    {
        db.AddUser(dto);
        return Ok();
    }
}