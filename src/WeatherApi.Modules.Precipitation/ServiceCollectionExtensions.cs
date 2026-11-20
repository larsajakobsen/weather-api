using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WeatherApi.Modules.Precipitation.Features.Precipitation;
using WeatherApi.Modules.Precipitation.Integrations.Met;

namespace WeatherApi.Modules.Precipitation;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPrecipitationModule(this IServiceCollection services, IConfiguration configuration)
    {
        var metOptions = configuration.GetSection(MetNowcastOptions.SectionName).Get<MetNowcastOptions>() ?? new MetNowcastOptions();

        services.AddHttpClient<IMetNowcastClient, MetNowcastClient>(client =>
        {
            client.BaseAddress = new Uri(metOptions.BaseUrl);
            client.DefaultRequestHeaders.UserAgent.ParseAdd(metOptions.UserAgent);
        });

        services.AddPrecipitationFeatures();

        return services;
    }
}
