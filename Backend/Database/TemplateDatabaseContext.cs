using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Database
{
    public class TemplateDatabaseContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<DefaultDataType> DefaultDataTable { get; set; }
    }
}