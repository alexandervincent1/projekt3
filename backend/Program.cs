using System.Linq;
using System.Text;
using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using projekt3.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "" // Disable static file requirement
});

var configuration = builder.Configuration;

// Database connection
var connectionString = configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=BestallningsSystem;User=myuser;Password=mypassword;";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 36)))
);

// Add controllers with JSON settings to handle circular references
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Use CORS
app.UseCors("AllowAll");

// Health endpoint
app.MapGet("/health", () => Results.Json(new { status = "healthy", time = DateTime.UtcNow }));

// API documentation
app.MapGet("/docs", (IEnumerable<EndpointDataSource> endpointSources) =>
{
    var endpoints = endpointSources
        .SelectMany(es => es.Endpoints)
        .Select(e => new {
            route = (e as RouteEndpoint)?.RoutePattern?.RawText ?? "N/A",
            methods = e.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods ?? new[] { "N/A" }
        })
        .ToList();
    
    return Results.Json(endpoints);
});

app.MapControllers();

app.Run();