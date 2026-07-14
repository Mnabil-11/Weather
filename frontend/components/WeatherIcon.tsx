import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun } from 'lucide-react';

export function WeatherIcon({ code, isDay = true, className = '' }: { code: number; isDay?: boolean; className?: string }) {
  const Icon = !isDay && (code === 1000 || code === 1003) ? Moon
    : code === 1000 ? Sun
    : [1066, 1069, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1240, 1243, 1246, 1249, 1252, 1255, 1258, 1261, 1264].includes(code) ? CloudSnow
    : [1087, 1273, 1276, 1279, 1282].includes(code) ? CloudLightning
    : [1063, 1150, 1153, 1180, 1183].includes(code) ? CloudDrizzle
    : [1186, 1189, 1192, 1195, 1198, 1201, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code) ? CloudRain
    : [1003, 1006, 1009, 1030, 1135, 1147].includes(code) ? CloudSun : Cloud;
  return <Icon aria-hidden="true" className={className} strokeWidth={1.6} />;
}
