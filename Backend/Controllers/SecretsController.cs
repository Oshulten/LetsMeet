using Backend.Database;
using Backend.Dto;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SecretsController(TemplateDatabaseContext context, IConfiguration configuration) : ControllerBase
{
    [HttpGet("google-maps-api-key")]
    [ProducesResponseType(200, Type = typeof(ApiKey))]
    [ProducesResponseType(404)]
    public ActionResult<ApiKey> GoogleMapsApiKey()
    {
        return configuration["google-api-key"] is string key
            ? Ok(new ApiKey(key))
            : NotFound();
    }
}