using System.Text.Json.Serialization;

namespace WeatherApi.Modules.Precipitation.Integrations.Met;

internal sealed class NowcastResponse
{
    [JsonPropertyName("properties")]
    public NowcastProperties? Properties { get; init; }
}

internal sealed class NowcastProperties
{
    [JsonPropertyName("meta")]
    public NowcastMeta? Meta { get; init; }

    [JsonPropertyName("timeseries")]
    public List<NowcastTimeseriesEntry>? Timeseries { get; init; }
}

internal sealed class NowcastMeta
{
    [JsonPropertyName("radar_coverage")]
    public string? RadarCoverage { get; init; }
}

internal sealed class NowcastTimeseriesEntry
{
    [JsonPropertyName("time")]
    public DateTimeOffset Time { get; init; }

    [JsonPropertyName("data")]
    public NowcastData? Data { get; init; }
}

internal sealed class NowcastData
{
    [JsonPropertyName("instant")]
    public NowcastInstant? Instant { get; init; }
}

internal sealed class NowcastInstant
{
    [JsonPropertyName("details")]
    public NowcastDetails? Details { get; init; }
}

internal sealed class NowcastDetails
{
    [JsonPropertyName("precipitation_rate")]
    public double? PrecipitationRate { get; init; }
}
