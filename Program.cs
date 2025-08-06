using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NLog.Web;
using RunApp.Middleware;
using RunApp.Models;
using RunApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
builder.Host.UseNLog();

// Add services to the container.

// Configure Kestrel ports from appsettings.json
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Configure(builder.Configuration.GetSection("Kestrel"));
});

// Read ConnectionString
var connectionString = builder.Configuration.GetConnectionString("RunDatabase");
builder.Services.AddDbContext<RunDbContext>(options =>
    options.UseSqlite(connectionString));


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<RunDbContext>();

builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddScoped<IRunService, RunService>();
builder.Services.AddScoped<ITrainingPlanService, TrainingPlanService>();

builder.Services.AddScoped<ErrorHandlingMiddleware>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<RunDbContext>();
    dbContext.Database.Migrate();
}

app.UseCors();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
