using System.Threading.Tasks;
using System.Collections.Generic;
using MillionProperty.Domain;

namespace MillionProperty.Application.Properties
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _repo;

        public PropertyService(IPropertyRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<PropertyDto>> GetPropertiesAsync(string? name, string? address, decimal? minPrice, decimal? maxPrice)
        {
            return await _repo.GetPropertiesWithImagesAsync(name, address, minPrice, maxPrice);
        }

        public async Task<PropertyDetailDto?> GetPropertyDetailsAsync(string id)
        {
            var property = await _repo.GetPropertyByIdAsync(id);
            if (property is null)
            {
                return null;
            }

            // Optimization: Run these tasks in parallel
            var ownerTask = _repo.GetOwnerByIdAsync(property.IdOwner);
            var imagesTask = _repo.GetImagesByPropertyIdAsync(property.Id);
            var tracesTask = _repo.GetTracesByPropertyIdAsync(property.Id);

            await Task.WhenAll(ownerTask, imagesTask, tracesTask);

            var owner = await ownerTask;
            var images = await imagesTask;
            var traces = await tracesTask;

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

            return detailDto;
        }
    }
}
