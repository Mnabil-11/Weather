# Atmos Weather Dashboard

## Setup

1. Install Node.js 18.17+ and create a free WeatherAPI.com account.
2. In this folder, run `npm install`.
3. Copy `.env.local.example` to `.env.local`, then replace `WEATHER_API_KEY` with your WeatherAPI.com key.
4. Run `npm run dev` and visit [http://localhost:3000](http://localhost:3000).

The API key is deliberately server-only. `lib/weatherService.ts` communicates with WeatherAPI; the client calls the protected Next.js route handlers in `app/api`.

## Project map

- `components/Dashboard.tsx` — state, geolocation, units, theme, loading/error UI
- `components/SearchBar.tsx` — debounced city autocomplete and Enter-key search
- `components/WeatherCard.tsx` and `components/Forecast.tsx` — responsive weather UI
- `lib/weatherService.ts` — WeatherAPI.com server service
