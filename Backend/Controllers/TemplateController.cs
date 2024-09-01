using Backend.Database;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemplateController(TemplateDatabaseContext context) : ControllerBase
{
    [HttpGet]
    public string TemplateGreeting()
    {
        return "TemplateEndpoint";
    }
}