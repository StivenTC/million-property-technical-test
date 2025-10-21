using Microsoft.Extensions.Logging;
using MillionProperty.Domain;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

namespace MillionProperty.Infrastructure.Data;

public static class DbSeeder
{
  public static async Task SeedAllCollectionsAsync(IMongoDatabase database, ILogger logger)
  {
    await SeedCollectionAsync<Property>(database, logger, "Property", "Property.json");
    await SeedCollectionAsync<Owner>(database, logger, "Owner", "Owner.json");
    await SeedCollectionAsync<PropertyImage>(database, logger, "PropertyImage", "PropertyImage.json");
    await SeedCollectionAsync<PropertyTrace>(database, logger, "PropertyTrace", "PropertyTrace.json");
  }

  private static async Task SeedCollectionAsync<T>(IMongoDatabase database, ILogger logger, string collectionName, string fileName)
  {
    var collection = database.GetCollection<T>(collectionName);

    if (await collection.CountDocumentsAsync(FilterDefinition<T>.Empty) > 0)
    {
      logger.LogInformation($"Collection '{collectionName}' already seeded.");
      return;
    }

    logger.LogInformation($"Start seeding collection '{collectionName}'...");

    try
    {
      var solutionRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", ".."));
      var seedDataPath = Path.Combine(solutionRoot, "data", fileName);

      if (!File.Exists(seedDataPath))
      {
        logger.LogError($"Seed data file not found at: {seedDataPath}");
        return;
      }

      var jsonData = await File.ReadAllTextAsync(seedDataPath);

      var documents = BsonSerializer.Deserialize<List<T>>(jsonData);

      if (documents != null && documents.Any())
      {
        await collection.InsertManyAsync(documents);
        logger.LogInformation($"{documents.Count} documents have been added to the '{collectionName}' collection.");
      }
      else
      {
        logger.LogWarning($"Seed data for '{collectionName}' is empty or could not be deserialized.");
      }
    }
    catch (Exception ex)
    {
      logger.LogError(ex, $"An error occurred while seeding the '{collectionName}' collection.");
    }
  }
}
