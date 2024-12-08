import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from 'react-icons/wi';

const WeatherCard = ({ weather, forecast }) => {
  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <WiDaySunny className="h-7 w-7 text-blue-600" />;
      case 'Clouds':
        return <WiCloud className="h-7 w-7 text-blue-600" />;
      case 'Rain':
      case 'Drizzle':
        return <WiRain className="h-7 w-7 text-blue-600" />;
      case 'Snow':
        return <WiSnow className="h-7 w-7 text-blue-600" />;
      case 'Thunderstorm':
        return <WiThunderstorm className="h-7 w-7 text-blue-600" />;
      default:
        return <WiFog className="h-7 w-7 text-blue-600" />;
    }
  };

  const getDailyForecasts = () => {
    if (!forecast || !forecast.list) return [];

    const dailyData = forecast.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = item;
      }
      return acc;
    }, {});

    return Object.values(dailyData).slice(1, 4);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
  };

  return (
    <Card className="bg-blue-50 min-h-[8rem]">
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-full">
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            <div>
              <p className="text-sm text-gray-600">Clima Atual</p>
              <p className="text-xl font-bold">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-sm text-gray-600">
                {weather.weather[0].description}
              </p>
              <p className="text-xs text-gray-500">{weather.name}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600 mb-0.5">Próximos dias</p>
            <div className="flex gap-3">
              {getDailyForecasts().map((day) => (
                <div key={day.dt} className="text-center">
                  <p className="text-xs font-medium">{formatDate(day.dt)}</p>
                  <div className="flex justify-center">
                    {getWeatherIcon(day.weather[0].main)}
                  </div>
                  <div className="text-xs">
                    <span>{Math.round(day.main.temp_max)}°</span>
                    <span className="text-gray-500 mx-1">/</span>
                    <span className="text-gray-500">
                      {Math.round(day.main.temp_min)}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
