using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using MillionProperty.Application.Properties;
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
      File = "http://example.com/example.png",
      Enabled = true
    };
    var propertiesList = new List<Property> { testProperty };

    _mockRepo.Setup(repo => repo.GetPropertiesAsync(
            It.IsAny<string>(), It.IsAny<string>(), It.IsAny<decimal?>(), It.IsAny<decimal?>()))
        .ReturnsAsync(propertiesList);

    _mockRepo.Setup(repo => repo.GetFirstImageByPropertyIdAsync("prop1"))
        .ReturnsAsync(testImage);

    var response = await _client.GetAsync("/api/properties");

    response.EnsureSuccessStatusCode();

    List<PropertyDto>? dtos = await response.Content.ReadFromJsonAsync<List<PropertyDto>>();

    Assert.IsNotNull(dtos);
    Assert.That(dtos[0].Id, Is.EqualTo("prop1"));
    Assert.That(dtos!.Count, Is.EqualTo(1));
    Assert.That(dtos[0].Name, Is.EqualTo("Test Property"));
    Assert.That(dtos[0].ImageUrl, Is.EqualTo("http://example.com/example.png"));
  }

  [Test]
  public async Task GetPropertyById_ReturnsOk_When_IdExists()
  {
    var testId = "good-id";

    var testProperty = new Property
    {
      Id = testId,
      Name = "Found Property",
      IdOwner = "owner-123"
    };
    var testOwner = new Owner { Id = "owner-123", Name = "Test Owner" };
    var testImages = new List<PropertyImage>
        {
            new PropertyImage { Id = "img-1", IdProperty = testId, File = "url1", Enabled = true }
        };
    var testTraces = new List<PropertyTrace>
        {
            new PropertyTrace { Id = "trace-1", IdProperty = testId, Name = "Venta", Value = 500 }
        };

    _mockRepo.Setup(repo => repo.GetPropertyByIdAsync(testId))
        .ReturnsAsync(testProperty);

    _mockRepo.Setup(repo => repo.GetOwnerByIdAsync("owner-123"))
        .ReturnsAsync(testOwner);

    _mockRepo.Setup(repo => repo.GetImagesByPropertyIdAsync(testId))
        .ReturnsAsync(testImages);

    _mockRepo.Setup(repo => repo.GetTracesByPropertyIdAsync(testId))
        .ReturnsAsync(testTraces);

    var response = await _client.GetAsync($"/api/properties/{testId}");

    response.EnsureSuccessStatusCode();

    var detailDto = await response.Content.ReadFromJsonAsync<PropertyDetailDto>();

    Assert.IsNotNull(detailDto);

    Assert.That(detailDto.Id, Is.EqualTo(testId));
    Assert.That(detailDto.Name, Is.EqualTo("Found Property"));

    Assert.IsNotNull(detailDto.Owner);
    Assert.That(detailDto.Owner.Name, Is.EqualTo("Test Owner"));

    Assert.IsNotNull(detailDto.Images);
    Assert.That(detailDto.Images.Count(), Is.EqualTo(1));
    Assert.That(detailDto.Images.First().File, Is.EqualTo("url1"));

    Assert.IsNotNull(detailDto.Traces);
    Assert.That(detailDto.Traces.Count(), Is.EqualTo(1));
    Assert.That(detailDto.Traces.First().Name, Is.EqualTo("Venta"));
  }

  [Test]
  public async Task GetPropertyById_ReturnsNotFound_When_IdDoesNotExist()
  {
    var testId = "bad-id";

    _mockRepo.Setup(repo => repo.GetPropertyByIdAsync(testId))
        .ReturnsAsync((Property?)null);

    var response = await _client.GetAsync($"/api/properties/{testId}");

    Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
  }
}