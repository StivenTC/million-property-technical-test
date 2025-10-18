using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MillionProperty.Domain;

public class PropertyTrace
{
  [BsonId]
  [BsonRepresentation(BsonType.ObjectId)]
  public string Id { get; set; } = string.Empty;

  public DateTime DateSale { get; set; }

  public string Name { get; set; } = string.Empty;

  [BsonRepresentation(BsonType.Decimal128)]
  public decimal Value { get; set; }

  [BsonRepresentation(BsonType.Decimal128)]
  public decimal Tax { get; set; }

  [BsonRepresentation(BsonType.ObjectId)]
  public string IdProperty { get; set; } = string.Empty;

}