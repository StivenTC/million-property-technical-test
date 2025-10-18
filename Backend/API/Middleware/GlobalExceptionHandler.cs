using System.Net;
using System.Text.Json;

namespace MillionProperty.API.Middleware;

public class GlobalExceptionHandler : Microsoft.AspNetCore.Diagnostics.IExceptionHandler
{
  private readonly ILogger<GlobalExceptionHandler> _logger;

  public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
  {
    _logger = logger;
  }

  public async ValueTask<bool> TryHandleAsync(
      HttpContext httpContext,
      Exception exception,
      CancellationToken cancellationToken)
  {
    _logger.LogError(exception, $"Ha ocurrido una excepción: {exception.Message}");

    var problemDetails = new
    {
      Status = (int)HttpStatusCode.InternalServerError,
      Title = "Error interno del servidor",
      Detail = "Ha ocurrido un error inesperado. Por favor, intente más tarde."
    };

    httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
    httpContext.Response.ContentType = "application/json";

    await httpContext.Response.WriteAsync(JsonSerializer.Serialize(problemDetails), cancellationToken);

    return true;
  }
}