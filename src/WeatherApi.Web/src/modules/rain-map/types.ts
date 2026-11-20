export type PrecipitationStatus = 'Ok' | 'NoData';

export interface CurrentPrecipitationResponse {
  status: PrecipitationStatus;
  latitude: number;
  longitude: number;
  precipitationRateMillimetersPerHour: number | null;
  isRaining: boolean | null;
  observedAt: string | null;
}
