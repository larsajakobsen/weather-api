using System.Globalization;
using System.Net;
using WeatherApi.Modules.Precipitation.Integrations.Met;
using Xunit;

namespace WeatherApi.Modules.Precipitation.Tests.Integrations.Met;

public sealed class MetNowcastClientTests
{
    private const string NowcastWithPrecipitationJson = """
    {
      "properties": {
        "meta": { "radar_coverage": "ok" },
        "timeseries": [
          {
            "time": "2026-11-20T12:00:00Z",
            "data": { "instant": { "details": { "precipitation_rate": 0.3 } } }
          }
        ]
      }
    }
    """;

    private const string NowcastWithoutRadarCoverageJson = """
    {
      "properties": {
        "meta": { "radar_coverage": "unknown" },
        "timeseries": [
          {
            "time": "2026-11-20T12:00:00Z",
            "data": { "instant": { "details": { "precipitation_rate": 0.3 } } }
          }
        ]
      }
    }
    """;

    private const string NowcastWithEmptyTimeseriesJson = """
    {
      "properties": {
        "meta": { "radar_coverage": "ok" },
        "timeseries": []
      }
    }
    """;

    [Fact]
    public async Task GetCurrentPrecipitationAsync_WhenRadarCoverageIsOk_ReturnsPrecipitationRate()
    {
        var handler = new FakeHttpMessageHandler(HttpStatusCode.OK, NowcastWithPrecipitationJson);
        var client = CreateClient(handler);

        var result = await client.GetCurrentPrecipitationAsync(59.9139, 10.7522, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(0.3, result!.PrecipitationRateMillimetersPerHour);
    }

    [Fact]
    public async Task GetCurrentPrecipitationAsync_WhenRadarCoverageIsNotOk_ReturnsNull()
    {
        var handler = new FakeHttpMessageHandler(HttpStatusCode.OK, NowcastWithoutRadarCoverageJson);
        var client = CreateClient(handler);

        var result = await client.GetCurrentPrecipitationAsync(59.9139, 10.7522, CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetCurrentPrecipitationAsync_WhenTimeseriesIsEmpty_ReturnsNull()
    {
        var handler = new FakeHttpMessageHandler(HttpStatusCode.OK, NowcastWithEmptyTimeseriesJson);
        var client = CreateClient(handler);

        var result = await client.GetCurrentPrecipitationAsync(59.9139, 10.7522, CancellationToken.None);

        Assert.Null(result);
    }

    [Theory]
    [InlineData(HttpStatusCode.UnprocessableEntity)]
    [InlineData(HttpStatusCode.NotFound)]
    public async Task GetCurrentPrecipitationAsync_WhenLocationIsOutsideCoverage_ReturnsNull(HttpStatusCode statusCode)
    {
        var handler = new FakeHttpMessageHandler(statusCode, content: null);
        var client = CreateClient(handler);

        var result = await client.GetCurrentPrecipitationAsync(59.9139, 10.7522, CancellationToken.None);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetCurrentPrecipitationAsync_SendsConfiguredUserAgent()
    {
        HttpRequestMessage? capturedRequest = null;
        var handler = new FakeHttpMessageHandler(HttpStatusCode.OK, NowcastWithPrecipitationJson, request => capturedRequest = request);
        var client = CreateClient(handler, userAgent: "weather-api-tests/1.0");

        await client.GetCurrentPrecipitationAsync(59.9139, 10.7522, CancellationToken.None);

        Assert.NotNull(capturedRequest);
        Assert.Equal("weather-api-tests/1.0", capturedRequest!.Headers.UserAgent.ToString());
    }

    [Fact]
    public async Task GetCurrentPrecipitationAsync_RoundsCoordinatesToFourDecimalsUsingInvariantCulture()
    {
        var originalCulture = CultureInfo.CurrentCulture;
        CultureInfo.CurrentCulture = CultureInfo.GetCultureInfo("nb-NO");

        try
        {
            HttpRequestMessage? capturedRequest = null;
            var handler = new FakeHttpMessageHandler(HttpStatusCode.OK, NowcastWithPrecipitationJson, request => capturedRequest = request);
            var client = CreateClient(handler);

            await client.GetCurrentPrecipitationAsync(59.123456789, 10.987654321, CancellationToken.None);

            Assert.NotNull(capturedRequest);
            var query = capturedRequest!.RequestUri!.Query;
            Assert.Contains("lat=59.1235", query);
            Assert.Contains("lon=10.9877", query);
        }
        finally
        {
            CultureInfo.CurrentCulture = originalCulture;
        }
    }

    private static MetNowcastClient CreateClient(HttpMessageHandler handler, string userAgent = "weather-api-tests/1.0")
    {
        var httpClient = new HttpClient(handler)
        {
            BaseAddress = new Uri("https://api.met.no/"),
        };
        httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(userAgent);

        return new MetNowcastClient(httpClient);
    }
}
