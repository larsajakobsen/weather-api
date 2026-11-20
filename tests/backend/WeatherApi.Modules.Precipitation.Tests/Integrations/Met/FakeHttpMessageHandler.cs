using System.Net;
using System.Text;

namespace WeatherApi.Modules.Precipitation.Tests.Integrations.Met;

internal sealed class FakeHttpMessageHandler(HttpStatusCode statusCode, string? content, Action<HttpRequestMessage>? onRequest = null) : HttpMessageHandler
{
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        onRequest?.Invoke(request);

        var response = new HttpResponseMessage(statusCode)
        {
            Content = content is null ? null : new StringContent(content, Encoding.UTF8, "application/json"),
        };

        return Task.FromResult(response);
    }
}
