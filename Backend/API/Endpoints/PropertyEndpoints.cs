using MillionProperty.Application.Properties;

namespace MillionProperty.API.Endpoints;

public static class PropertyEndpoints
{
  public static void MapPropertyEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapGet("/api/properties", async (
        IPropertyRepository propertyRepo,
        string? name,
        string? address,
        decimal? minPrice,
        decimal? maxPrice) =>
    {
      var propertyDtos = await propertyRepo.GetPropertiesWithImagesAsync(name, address, minPrice, maxPrice);
      return Results.Ok(propertyDtos);

    })
    .WithName("GetProperties")
    .WithTags("Properties")
    .WithSummary("Obtener lista de propiedades (con filtros)")
    .WithDescription("Devuelve una lista de propiedades. Si no se envían parámetros de consulta, devuelve todas. Se puede filtrar por 'name', 'address', 'minPrice' y 'maxPrice'.");

    app.MapGet("/api/properties/{id}", async (string id, IPropertyRepository repo) =>
    {
      var property = await repo.GetPropertyByIdAsync(id);
      if (property is null)
      {
        return Results.NotFound();
      }

      var owner = await repo.GetOwnerByIdAsync(property.IdOwner);
      var images = await repo.GetImagesByPropertyIdAsync(property.Id);
      var traces = await repo.GetTracesByPropertyIdAsync(property.Id);

      var detailDto = new PropertyDetailDto
      {
        Id = property.Id,
        Name = property.Name,
        Address = property.Address,
        Price = property.Price,
        CodeInternal = property.CodeInternal,
        Year = property.Year,
        Owner = owner,
        Images = images,
        Traces = traces
      };

      return Results.Ok(detailDto);
    })
    .WithName("GetPropertyById")
    .WithTags("Properties")
    .WithSummary("Obtener detalles de una propiedad por su ID")
    .WithDescription("Devuelve los detalles completos de una propiedad específica usando su ID (ObjectId).");
  }
}