using Microsoft.AspNetCore.Mvc;
using WeatherApi.Modules.Precipitation.Features.Precipitation.GetCurrentPrecipitation;

namespace WeatherApi.API.Controllers;

[ApiController]
[Route("api/precipitation")]
public sealed class PrecipitationController(GetCurrentPrecipitationFeature getCurrentPrecipitationFeature) : ControllerBase
{
    [HttpGet("current")]
    public async Task<ActionResult<CurrentPrecipitationResponse>> GetCurrent(
        [FromQuery] double latitude,
        [FromQuery] double longitude,
        CancellationToken cancellationToken)
    {
        if (latitude is < -90 or > 90 || longitude is < -180 or > 180)
        {
            return BadRequest();
        }

        var result = await getCurrentPrecipitationFeature.HandleAsync(latitude, longitude, cancellationToken);
        return Ok(result);
    }
}
