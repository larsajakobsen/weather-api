namespace WeatherApi.Modules.Precipitation.Integrations.Met;

public interface IMetNowcastClient
{
    Task<MetNowcastResult?> GetCurrentPrecipitationAsync(double latitude, double longitude, CancellationToken cancellationToken);
}
