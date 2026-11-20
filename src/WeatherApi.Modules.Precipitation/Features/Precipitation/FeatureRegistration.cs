using Microsoft.Extensions.DependencyInjection;
using WeatherApi.Modules.Precipitation.Features.Precipitation.GetCurrentPrecipitation;

namespace WeatherApi.Modules.Precipitation.Features.Precipitation;

internal static class FeatureRegistration
{
    public static IServiceCollection AddPrecipitationFeatures(this IServiceCollection services)
    {
        services.AddScoped<GetCurrentPrecipitationFeature>();

        return services;
    }
}
