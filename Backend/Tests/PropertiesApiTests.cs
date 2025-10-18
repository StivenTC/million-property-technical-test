using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using MillionProperty.Application;
using MillionProperty.Domain;
using Moq;

namespace MillionProperty.Tests;

public class PropertiesApiTests
{
  private WebApplicationFactory<Program> _factory;
  private Mock<IPropertyRepository> _mockRepo;
  private HttpClient _client;

  [SetUp]
  public void Setup()
  {
    _mockRepo = new Mock<IPropertyRepository>();

    _factory = new WebApplicationFactory<Program>()
        .WithWebHostBuilder(builder =>
        {
          builder.ConfigureTestServices(services =>
              {
                var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(IPropertyRepository));
                if (descriptor != null)
                {
                  services.Remove(descriptor);
                }
                services.AddSingleton(_mockRepo.Object);
              });
        });

    _client = _factory.CreateClient();
  }

  [TearDown]
  public void TearDown()
  {
    _client.Dispose();
    _factory.Dispose();
  }

  [Test]
  public async Task GetProperties_ReturnsOkWithPropertyDtos()
  {
    // --- ARRANGE ---
    var testProperty = new Property
    {
      Id = "prop1",
      Name = "Test Property",
      Address = "123 Main St",
      Price = 1000,
      IdOwner = "owner1"
    };

    var testImage = new PropertyImage
    {
      Id = "img1",
      IdProperty = "prop1",
      File = "https://example.com/image.png",
      Enabled = true
    };

    var propertiesList = new List<Property> { testProperty };

    _mockRepo.Setup(repo => repo.GetPropertiesAsync(
            It.IsAny<string>(), It.IsAny<string>(),
            It.IsAny<decimal?>(), It.IsAny<decimal?>()))
        .ReturnsAsync(propertiesList);

    _mockRepo.Setup(repo => repo.GetFirstImageByPropertyIdAsync("prop1"))
        .ReturnsAsync(testImage);

    var response = await _client.GetAsync("/api/properties");

    response.EnsureSuccessStatusCode();
    var dtos = await response.Content.ReadFromJsonAsync<List<PropertyDto>>();

    Assert.IsNotNull(dtos);
    Assert.That(dtos.Count, Is.EqualTo(1));
    Assert.That(dtos[0].Name, Is.EqualTo("Test Property"));
    Assert.That(dtos[0].ImageUrl, Is.EqualTo("https://example.com/image.png"));
  }
}