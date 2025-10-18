using MillionProperty.Domain;

namespace MillionProperty.Application;

public interface IPropertyRepository
{
  Task<IEnumerable<Property>> GetPropertiesAsync(
      string? name,
      string? address,
      decimal? minPrice,
      decimal? maxPrice
  );
  Task<Property?> GetPropertyByIdAsync(string id);
  Task<Owner?> GetOwnerByIdAsync(string id);
  Task<PropertyImage?> GetFirstImageByPropertyIdAsync(string propertyId);
}