using Microsoft.Extensions.Options;
using MillionProperty.API.Endpoints;
using MillionProperty.Application.Properties;
using MillionProperty.Infrastructure;
using MillionProperty.Infrastructure.Data;
using MillionProperty.Infrastructure.Properties;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddExceptionHandler<MillionProperty.API.Middleware.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowReactApp", policy =>
  {
    var allowedOrigins = builder.Configuration.GetValue<string>("CorsSettings:AllowedOrigins");

    var origins = !string.IsNullOrEmpty(allowedOrigins)
          ? allowedOrigins.Split(',')
          : new[] { "http://localhost:3000" };

    policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
  });
});

builder.Services.Configure<MillionProperty.Infrastructure.MongoDatabaseSettings>(
    builder.Configuration.GetSection("MongoDatabaseSettings"));

builder.Services.AddSingleton<IMongoClient>(sp =>
    new MongoClient(sp.GetRequiredService<IOptions<MillionProperty.Infrastructure.MongoDatabaseSettings>>().Value.ConnectionString));

builder.Services.AddSingleton<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IPropertyService, PropertyService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
  var services = scope.ServiceProvider;
  var dbSettings = services.GetRequiredService<IOptions<MillionProperty.Infrastructure.MongoDatabaseSettings>>().Value;
  var logger = services.GetRequiredService<ILogger<Program>>();
  try
  {
    var client = services.GetRequiredService<IMongoClient>();
    var database = client.GetDatabase(dbSettings.DatabaseName);
    await DbSeeder.SeedAllCollectionsAsync(database, logger);
  }
  catch (Exception ex)
  {
    logger.LogError(ex, "An error occurred during database seeding.");
  }
}

app.UseExceptionHandler();

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseSwagger();
app.UseSwaggerUI();

app.MapPropertyEndpoints();

app.Run();
