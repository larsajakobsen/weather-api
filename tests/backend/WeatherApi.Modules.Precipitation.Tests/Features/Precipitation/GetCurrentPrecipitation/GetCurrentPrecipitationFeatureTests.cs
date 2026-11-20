using WeatherApi.Modules.Precipitation.Features.Precipitation.GetCurrentPrecipitation;
using WeatherApi.Modules.Precipitation.Integrations.Met;
using Xunit;

namespace WeatherApi.Modules.Precipitation.Tests.Features.Precipitation.GetCurrentPrecipitation;

public sealed class GetCurrentPrecipitationFeatureTests
{
    [Fact]
    public async Task HandleAsync_WhenMetReturnsData_ReturnsOkWithPrecipitation()
    {
        var observedAt = new DateTimeOffset(2026, 11, 20, 12, 0, 0, TimeSpan.Zero);
        var client = new FakeMetNowcastClient(new MetNowcastResult(1.2, observedAt));
        var feature = new GetCurrentPrecipitationFeature(client);

        var result = await feature.HandleAsync(59.9139, 10.7522, CancellationToken.None);

        Assert.Equal(PrecipitationStatus.Ok, result.Status);
        Assert.Equal(1.2, result.PrecipitationRateMillimetersPerHour);
        Assert.True(result.IsRaining);
        Assert.Equal(observedAt, result.ObservedAt);
    }

    [Fact]
    public async Task HandleAsync_WhenPrecipitationRateIsZero_ReturnsOkWithIsRainingFalse()
    {
        var observedAt = new DateTimeOffset(2026, 11, 20, 12, 0, 0, TimeSpan.Zero);
        var client = new FakeMetNowcastClient(new MetNowcastResult(0, observedAt));
        var feature = new GetCurrentPrecipitationFeature(client);

        var result = await feature.HandleAsync(59.9139, 10.7522, CancellationToken.None);

        Assert.Equal(PrecipitationStatus.Ok, result.Status);
        Assert.False(result.IsRaining);
    }

    [Fact]
    public async Task HandleAsync_WhenMetReturnsNoData_ReturnsNoData()
    {
        var client = new FakeMetNowcastClient(result: null);
        var feature = new GetCurrentPrecipitationFeature(client);

        var result = await feature.HandleAsync(59.9139, 10.7522, CancellationToken.None);

        Assert.Equal(PrecipitationStatus.NoData, result.Status);
        Assert.Null(result.PrecipitationRateMillimetersPerHour);
        Assert.Null(result.IsRaining);
        Assert.Null(result.ObservedAt);
    }

    private sealed class FakeMetNowcastClient(MetNowcastResult? result) : IMetNowcastClient
    {
        public Task<MetNowcastResult?> GetCurrentPrecipitationAsync(double latitude, double longitude, CancellationToken cancellationToken) =>
            Task.FromResult(result);
    }
}
