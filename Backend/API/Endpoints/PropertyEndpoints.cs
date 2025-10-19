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
        .WithTags("Properties")
        .WithSummary("Obtener lista de propiedades (con filtros)")
        .WithDescription("Devuelve una lista de propiedades. Si no se envían parámetros de consulta, devuelve todas. Se puede filtrar por 'name', 'address', 'minPrice' y 'maxPrice'.");

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
        .WithTags("Properties")
        .WithSummary("Obtener detalles de una propiedad por su ID")
        .WithDescription("Devuelve los detalles completos de una propiedad específica usando su ID (ObjectId).");
    }
}
