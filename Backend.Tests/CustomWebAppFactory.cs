using Backend.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.SqlEdge;

namespace Backend.Tests;

public class CustomWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly SqlEdgeContainer _sqlContainer = new SqlEdgeBuilder().Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        var updatedConnectionString = _sqlContainer.GetConnectionString().Replace("Database=master", "Database=testing");
        builder.UseSetting("ConnectionStrings:DefaultConnection", updatedConnectionString);

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<LocationsDbContext>>();
            services.RemoveAll<LocationsDbContext>();
            services.AddDbContext<LocationsDbContext>(options =>
            {
                options.UseSqlServer(_sqlContainer.GetConnectionString());
            });
        });
    }

    public async Task InitializeAsync()
    {
        await _sqlContainer.StartAsync();
        using var serviceScope = this.Services.CreateAsyncScope();
        var service = (serviceScope.ServiceProvider.GetService<LocationsDbContext>()!);
        service.Database.EnsureCreated();
    }

    public new Task DisposeAsync() => _sqlContainer.DisposeAsync().AsTask();
}