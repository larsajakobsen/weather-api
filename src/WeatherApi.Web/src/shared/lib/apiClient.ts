const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function getJson<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const query = params
    ? `?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)])).toString()}`
    : '';

  const response = await fetch(`${API_BASE_URL}${path}${query}`);

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}
