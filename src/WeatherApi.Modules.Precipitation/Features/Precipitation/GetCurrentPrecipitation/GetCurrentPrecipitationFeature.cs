using WeatherApi.Modules.Precipitation.Integrations.Met;

namespace WeatherApi.Modules.Precipitation.Features.Precipitation.GetCurrentPrecipitation;

public sealed class GetCurrentPrecipitationFeature(IMetNowcastClient metNowcastClient)
{
    public async Task<CurrentPrecipitationResponse> HandleAsync(double latitude, double longitude, CancellationToken cancellationToken)
    {
        var nowcast = await metNowcastClient.GetCurrentPrecipitationAsync(latitude, longitude, cancellationToken);

        return nowcast is null
            ? CurrentPrecipitationResponse.NoData(latitude, longitude)
            : CurrentPrecipitationResponse.Ok(latitude, longitude, nowcast.PrecipitationRateMillimetersPerHour, nowcast.ObservedAt);
    }
}
