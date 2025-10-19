using MillionProperty.Domain;

namespace MillionProperty.Application.Properties;

public class PropertyDetailDto
{
  public string Id { get; set; } = string.Empty;
  public string Name { get; set; } = string.Empty;
  public string Address { get; set; } = string.Empty;
  public decimal Price { get; set; }
  public string CodeInternal { get; set; } = string.Empty;
  public int Year { get; set; }

  public Owner? Owner { get; set; } // El objeto Dueño completo
  public IEnumerable<PropertyImage> Images { get; set; } = new List<PropertyImage>();
  public IEnumerable<PropertyTrace> Traces { get; set; } = new List<PropertyTrace>();
}