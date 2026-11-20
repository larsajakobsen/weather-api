namespace WeatherApi.Modules.Precipitation.Features.Precipitation.GetCurrentPrecipitation;

public enum PrecipitationStatus
{
    Ok,
    NoData,
}

public sealed record CurrentPrecipitationResponse(
    PrecipitationStatus Status,
    double Latitude,
    double Longitude,
    double? PrecipitationRateMillimetersPerHour,
    bool? IsRaining,
    DateTimeOffset? ObservedAt)
{
    public static CurrentPrecipitationResponse NoData(double latitude, double longitude) =>
        new(PrecipitationStatus.NoData, latitude, longitude, null, null, null);

    public static CurrentPrecipitationResponse Ok(double latitude, double longitude, double precipitationRateMillimetersPerHour, DateTimeOffset observedAt) =>
        new(PrecipitationStatus.Ok, latitude, longitude, precipitationRateMillimetersPerHour, precipitationRateMillimetersPerHour > 0, observedAt);
}
