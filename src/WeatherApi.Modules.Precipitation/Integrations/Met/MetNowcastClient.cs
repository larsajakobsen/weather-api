using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace WeatherApi.Modules.Precipitation.Integrations.Met;

public sealed class MetNowcastClient(HttpClient httpClient) : IMetNowcastClient
{
    public async Task<MetNowcastResult?> GetCurrentPrecipitationAsync(double latitude, double longitude, CancellationToken cancellationToken)
    {
        var requestUri = BuildRequestUri(latitude, longitude);

        using var response = await httpClient.GetAsync(requestUri, cancellationToken);

        if (response.StatusCode is HttpStatusCode.UnprocessableEntity or HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        NowcastResponse? payload;
        try
        {
            payload = await response.Content.ReadFromJsonAsync<NowcastResponse>(cancellationToken: cancellationToken);
        }
        catch (JsonException)
        {
            return null;
        }

        var radarCoverage = payload?.Properties?.Meta?.RadarCoverage;
        if (!string.Equals(radarCoverage, "ok", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var firstEntry = payload?.Properties?.Timeseries?.FirstOrDefault();
        var precipitationRate = firstEntry?.Data?.Instant?.Details?.PrecipitationRate;

        if (firstEntry is null || precipitationRate is null)
        {
            return null;
        }

        return new MetNowcastResult(precipitationRate.Value, firstEntry.Time);
    }

    private static string BuildRequestUri(double latitude, double longitude)
    {
        var lat = latitude.ToString("0.####", CultureInfo.InvariantCulture);
        var lon = longitude.ToString("0.####", CultureInfo.InvariantCulture);
        return $"weatherapi/nowcast/2.0/complete?lat={lat}&lon={lon}";
    }
}
