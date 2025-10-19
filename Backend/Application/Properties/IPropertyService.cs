using System.Collections.Generic;
using System.Threading.Tasks;

namespace MillionProperty.Application.Properties
{
    public interface IPropertyService
    {
        Task<IEnumerable<PropertyDto>> GetPropertiesAsync(string? name, string? address, decimal? minPrice, decimal? maxPrice);
        Task<PropertyDetailDto?> GetPropertyDetailsAsync(string id);
    }
}
