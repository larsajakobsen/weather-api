namespace WeatherApi.Modules.Precipitation.Integrations.Met;

public sealed record MetNowcastResult(double PrecipitationRateMillimetersPerHour, DateTimeOffset ObservedAt);
