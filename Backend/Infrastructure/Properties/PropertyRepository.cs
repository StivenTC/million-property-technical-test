using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MillionProperty.Application.Properties;
using MillionProperty.Domain;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MillionProperty.Infrastructure.Properties;

public class PropertyRepository : IPropertyRepository
{
  private readonly IMongoCollection<Property> _propertiesCollection;
  private readonly IMongoCollection<Owner> _ownersCollection;
  private readonly IMongoCollection<PropertyImage> _imagesCollection;
  private readonly IMongoCollection<PropertyTrace> _tracesCollection;
  private readonly ILogger<PropertyRepository> _logger;

  public PropertyRepository(IMongoClient mongoClient, IOptions<MongoDatabaseSettings> settings, ILogger<PropertyRepository> logger)
  {
    _logger = logger;
    var mongoDatabase = mongoClient.GetDatabase(settings.Value.DatabaseName);

    _propertiesCollection = mongoDatabase.GetCollection<Property>(settings.Value.PropertiesCollectionName);
    _ownersCollection = mongoDatabase.GetCollection<Owner>(settings.Value.OwnersCollectionName);
    _imagesCollection = mongoDatabase.GetCollection<PropertyImage>(settings.Value.ImagesCollectionName);
    _tracesCollection = mongoDatabase.GetCollection<PropertyTrace>(settings.Value.TracesCollectionName);
  }

  public async Task<IEnumerable<Property>> GetPropertiesAsync(
      string? name, string? address, decimal? minPrice, decimal? maxPrice)
  {
    var filterBuilder = Builders<Property>.Filter;
    var filter = filterBuilder.Empty;

    if (!string.IsNullOrWhiteSpace(name))
    {
      filter &= filterBuilder.Regex(p => p.Name, new BsonRegularExpression(name, "i"));
    }

    if (!string.IsNullOrWhiteSpace(address))
    {
      filter &= filterBuilder.Regex(p => p.Address, new BsonRegularExpression(address, "i"));
    }

    if (minPrice.HasValue)
    {
      filter &= filterBuilder.Gte(p => p.Price, minPrice.Value);
    }

    if (maxPrice.HasValue)
    {
      filter &= filterBuilder.Lte(p => p.Price, maxPrice.Value);
    }

    return await _propertiesCollection.Find(filter).ToListAsync();
  }

  public async Task<IEnumerable<PropertyDto>> GetPropertiesWithImagesAsync(string? name, string? address, decimal? minPrice, decimal? maxPrice)
  {
    _logger.LogInformation("--- Entering GetPropertiesWithImagesAsync ---");
    var count = await _propertiesCollection.CountDocumentsAsync(FilterDefinition<Property>.Empty);
    _logger.LogInformation("--- Found {Count} documents in _propertiesCollection before aggregation ---", count);

    var filterBuilder = Builders<Property>.Filter;
    var filter = filterBuilder.Empty;

    if (!string.IsNullOrWhiteSpace(name))
    {
      filter &= filterBuilder.Regex(p => p.Name, new BsonRegularExpression(name, "i"));
    }

    if (!string.IsNullOrWhiteSpace(address))
    {
      filter &= filterBuilder.Regex(p => p.Address, new BsonRegularExpression(address, "i"));
    }

    if (minPrice.HasValue)
    {
      filter &= filterBuilder.Gte(p => p.Price, minPrice.Value);
    }

    if (maxPrice.HasValue)
    {
      filter &= filterBuilder.Lte(p => p.Price, maxPrice.Value);
    }

    var aggregation = _propertiesCollection.Aggregate()
        .Match(filter)
        .Lookup(_imagesCollection.CollectionNamespace.CollectionName, "_id", "IdProperty", "Images")
        .Project(new BsonDocument
        {
              { "IdOwner", "$IdOwner" },
              { "Name", "$Name" },
              { "Address", "$Address" },
              { "Price", "$Price" },
              { "ImageUrl", new BsonDocument("$ifNull", new BsonArray { new BsonDocument("$arrayElemAt", new BsonArray { "$Images.file", 0 }), "" }) }
        })
        .As<PropertyDto>();

    var results = await aggregation.ToListAsync();
    _logger.LogInformation("--- Aggregation returned {Count} documents ---", results.Count);
    return results;
  }

  public async Task<Property?> GetPropertyByIdAsync(string id)
  {
    return await _propertiesCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
  }

  public async Task<Owner?> GetOwnerByIdAsync(string id)
  {
    return await _ownersCollection.Find(o => o.Id == id).FirstOrDefaultAsync();
  }

  public async Task<PropertyImage?> GetFirstImageByPropertyIdAsync(string propertyId)
  {
    return await _imagesCollection.Find(img => img.IdProperty == propertyId && img.Enabled)
                                  .FirstOrDefaultAsync();
  }
  public async Task<IEnumerable<PropertyImage>> GetImagesByPropertyIdAsync(string propertyId)
  {
    return await _imagesCollection.Find(img => img.IdProperty == propertyId && img.Enabled)
                                  .ToListAsync();
  }
  public async Task<IEnumerable<PropertyTrace>> GetTracesByPropertyIdAsync(string propertyId)
  {
    return await _tracesCollection.Find(t => t.IdProperty == propertyId)
                                  .ToListAsync();
  }
}
