# weather-api

## Kjør frontend

```sh
cd src/WeatherApi.Web
npm install
npm run dev     # starter utviklingsserveren
npm test        # kjører tester
npm run build   # produksjonsbygg
```

Regnkartet henter værdata fra eksterne tjenester i nettleseren:

- Kartdata: `https://tile.openstreetmap.org`
- Nedbørsdata: `https://api.rainviewer.com` og `https://tilecache.rainviewer.com`

Siden trenger ikke tilgang til egen backend eller API-nøkler, men krever at brukerens
posisjon kan hentes (HTTPS eller `localhost`).
