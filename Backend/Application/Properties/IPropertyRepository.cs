using MillionProperty.Domain;

namespace MillionProperty.Application.Properties;

public interface IPropertyRepository
{
    Task<IEnumerable<Property>> GetPropertiesAsync(
        string? name,
        string? address,
        decimal? minPrice,
        decimal? maxPrice
    );

    Task<IEnumerable<PropertyDto>> GetPropertiesWithImagesAsync(
        string? name,
        string? address,
        decimal? minPrice,
        decimal? maxPrice
    );

    Task<Property?> GetPropertyByIdAsync(string id);
    Task<Owner?> GetOwnerByIdAsync(string id);
    Task<PropertyImage?> GetFirstImageByPropertyIdAsync(string propertyId);
    Task<IEnumerable<PropertyImage>> GetImagesByPropertyIdAsync(string propertyId);
    Task<IEnumerable<PropertyTrace>> GetTracesByPropertyIdAsync(string propertyId);
}