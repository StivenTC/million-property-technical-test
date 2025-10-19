using MillionProperty.Infrastructure;
using MillionProperty.Application.Properties;
using MillionProperty.Infrastructure.Properties;
using MillionProperty.API.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddExceptionHandler<MillionProperty.API.Middleware.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowReactApp",
      policy =>
      {
        policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
      });
});

builder.Services.Configure<MongoDatabaseSettings>(
    builder.Configuration.GetSection("MongoDatabaseSettings"));

builder.Services.AddSingleton<IPropertyRepository, PropertyRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseExceptionHandler();

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.MapPropertyEndpoints();

app.Run();