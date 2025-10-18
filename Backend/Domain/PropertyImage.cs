using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MillionProperty.Domain;

public class PropertyImage
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = string.Empty;

  [BsonRepresentation(BsonType.ObjectId)]
  public string IdProperty { get; set; } = string.Empty;

  public string File { get; set; } = string.Empty;

  public bool Enabled { get; set; }
}