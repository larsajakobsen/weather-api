namespace WeatherApi.Modules.Precipitation.Integrations.Met;

public sealed class MetNowcastOptions
{
    public const string SectionName = "Met";

    public string BaseUrl { get; set; } = "https://api.met.no/";
    public string UserAgent { get; set; } = "weather-api/1.0";
}
