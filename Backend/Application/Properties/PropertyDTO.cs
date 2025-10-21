using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MillionProperty.Application.Properties;

public class PropertyDto
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = string.Empty;

  [BsonElement("IdOwner")]
  [BsonRepresentation(BsonType.ObjectId)]
  public string IdOwner { get; set; } = string.Empty;

  [BsonElement("Name")]
  public string Name { get; set; } = string.Empty;

  [BsonElement("Address")]
  public string Address { get; set; } = string.Empty;

  [BsonElement("Price")]
  public decimal Price { get; set; }

  [BsonElement("ImageUrl")]
  public string ImageUrl { get; set; } = string.Empty;
}
