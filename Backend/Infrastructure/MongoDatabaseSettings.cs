namespace MillionProperty.Infrastructure;

public class MongoDatabaseSettings
{
  public string ConnectionString { get; set; } = string.Empty;
  public string DatabaseName { get; set; } = string.Empty;
  public string PropertiesCollectionName { get; set; } = string.Empty;
  public string OwnersCollectionName { get; set; } = string.Empty;
  public string ImagesCollectionName { get; set; } = string.Empty;
  public string TracesCollectionName { get; set; } = string.Empty;
}