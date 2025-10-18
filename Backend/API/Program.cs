using MillionProperty.Application;
using MillionProperty.Domain;
using MillionProperty.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddExceptionHandler<MillionProperty.API.Middleware.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowReactApp",
      policy =>
      {
        policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
      });
});

builder.Services.Configure<MongoDatabaseSettings>(
    builder.Configuration.GetSection("MongoDatabaseSettings"));

builder.Services.AddSingleton<IPropertyRepository, PropertyRepository>();

var app = builder.Build();

app.UseExceptionHandler();

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.MapGet("/api/properties", async (
    IPropertyRepository propertyRepo,
    string? name,
    string? address,
    decimal? minPrice,
    decimal? maxPrice) =>
{
  var properties = await propertyRepo.GetPropertiesAsync(name, address, minPrice, maxPrice);

  var propertyDtos = new List<PropertyDto>();
  foreach (var prop in properties)
  {
    var image = await propertyRepo.GetFirstImageByPropertyIdAsync(prop.Id);

    propertyDtos.Add(new PropertyDto
    {
      IdOwner = prop.IdOwner,
      Name = prop.Name,
      Address = prop.Address,
      Price = prop.Price,
      ImageUrl = image?.File ?? string.Empty
    });
  }

  return Results.Ok(propertyDtos);

})
.WithName("GetProperties")
.WithTags("Properties");

app.MapGet("/api/properties/{id}", async (string id, IPropertyRepository propertyRepo) =>
{
  var property = await propertyRepo.GetPropertyByIdAsync(id);

  if (property is null)
  {
    return Results.NotFound();
  }

  return Results.Ok(property);

})
.WithName("GetPropertyById")
.WithTags("Properties");

app.Run();