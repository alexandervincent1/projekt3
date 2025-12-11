using System.Linq;
using System.Text;
using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using projekt3.Data;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("DefaultConnection")
                       ?? configuration["DefaultConnection"]
                       ?? "Server=localhost;Port=3306;Database=BestallningsSystem;User=myuser;Password=mypassword;";

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 0)))
);
builder.Services.AddCors(p => p.AddDefaultPolicy(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

// Serve static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Simple docs page that lists registered route patterns and display names
app.MapGet("/docs", (Microsoft.AspNetCore.Routing.EndpointDataSource ds) =>
{
    var endpoints = ds.Endpoints
        .OfType<Microsoft.AspNetCore.Routing.RouteEndpoint>()
        .OrderBy(e => e.RoutePattern.RawText)
        .ToList();

    var sb = new StringBuilder();
    sb.AppendLine("<!doctype html><html><head><meta charset='utf-8'><title>API Docs</title>");
    sb.AppendLine("<style>body{font-family:system-ui,Segoe UI,Roboto,Arial;margin:20px}table{border-collapse:collapse}th,td{padding:6px;border:1px solid #ccc}</style>");
    sb.AppendLine("</head><body>");
    sb.AppendLine("<h1>API endpoints</h1>");
    sb.AppendLine("<table><tr><th>Route</th><th>Display Name</th><th>Metadata</th></tr>");

    foreach (var e in endpoints)
    {
        var route = WebUtility.HtmlEncode(e.RoutePattern.RawText ?? "");
        var name = WebUtility.HtmlEncode(e.DisplayName ?? "");
        var meta = string.Join(", ", e.Metadata.Select(m => m.GetType().Name));
        sb.AppendLine($"<tr><td>{route}</td><td>{name}</td><td>{WebUtility.HtmlEncode(meta)}</td></tr>");
    }

    sb.AppendLine("</table>");
    sb.AppendLine("<p>Health: <a href=\"/health\">/health</a></p>");
    sb.AppendLine("</body></html>");

    return Results.Content(sb.ToString(), "text/html");
});

// Simple health endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", time = DateTime.UtcNow }));

app.Run();