import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  Cloud,
  CloudRain,
  Sun,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  Info,
  MapPin,
} from 'lucide-react';
import axios from 'axios';

const WeatherLog = ({
  selectedProject,
  setSelectedProject,
  projects,
  setProjects,
}) => {
  const [weatherData, setWeatherData] = useState({ history: [], forecast: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const city = 'Pouso Alegre';

  const determineWorkImpact = (weatherCondition, rainfall = 0) => {
    if (weatherCondition === 'Thunderstorm' || rainfall > 10) {
      return 'full';
    } else if (weatherCondition === 'Rain' || rainfall > 5) {
      return 'partial';
    }
    return 'none';
  };

  const getWorkImpactClass = (impact) => {
    const classes = {
      none: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      full: 'bg-red-100 text-red-800',
    };
    return classes[impact] || classes.none;
  };

  const getWorkImpactText = (impact) => {
    const text = {
      none: 'Sem Impacto',
      partial: 'Impacto Parcial',
      full: 'Paralisação Total',
    };
    return text[impact] || impact;
  };

  const WeatherIcon = ({ conditions }) => {
    switch (conditions.toLowerCase()) {
      case 'clear':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'drizzle':
        return <CloudDrizzle className="h-5 w-5 text-blue-400" />;
      case 'snow':
        return <CloudSnow className="h-5 w-5 text-blue-200" />;
      case 'thunderstorm':
        return <CloudLightning className="h-5 w-5 text-purple-500" />;
      default:
        return <Cloud className="h-5 w-5 text-gray-500" />;
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      const API_KEY = 'bc656b9222f7f091184dccaa5d217f50';
      const countryCode = 'BR';
      const lat = -22.2303;
      const lon = -45.9393;

      try {
        setLoading(true);

        // Buscar dados históricos - um por dia
        const historyData = [];
        for (let i = 5; i >= 1; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dt = Math.floor(date.getTime() / 1000);

          const historyResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&dt=${dt}&units=metric&lang=pt_br&appid=${API_KEY}`
          );

          historyData.push({
            date: date.toISOString().split('T')[0],
            time: new Date(historyResponse.data.dt * 1000).toLocaleTimeString(
              'pt-BR',
              { hour: '2-digit', minute: '2-digit' }
            ),
            conditions: historyResponse.data.weather[0].main.toLowerCase(),
            description: historyResponse.data.weather[0].description,
            temperature: Math.round(historyResponse.data.main.temp),
            rainfall: historyResponse.data.rain
              ? historyResponse.data.rain['1h'] || 0
              : 0,
            humidity: historyResponse.data.main.humidity,
            windSpeed: Math.round(historyResponse.data.wind.speed * 3.6),
            workImpact: determineWorkImpact(
              historyResponse.data.weather[0].main,
              historyResponse.data.rain ? historyResponse.data.rain['1h'] : 0
            ),
            isForecast: false,
          });
        }

        // Buscar previsão para os próximos dias
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&units=metric&lang=pt_br&appid=${API_KEY}`
        );

        const processedForecast = forecastResponse.data.list.map((entry) => ({
          date: new Date(entry.dt * 1000).toISOString().split('T')[0],
          time: new Date(entry.dt * 1000).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          conditions: entry.weather[0].main.toLowerCase(),
          description: entry.weather[0].description,
          temperature: Math.round(entry.main.temp),
          rainfall: entry.rain ? entry.rain['3h'] || 0 : 0,
          humidity: entry.main.humidity,
          windSpeed: Math.round(entry.wind.speed * 3.6),
          workImpact: determineWorkImpact(
            entry.weather[0].main,
            entry.rain ? entry.rain['3h'] : 0
          ),
          isForecast: true,
        }));

        // Agrupar previsões por data, excluindo o dia atual
        const today = new Date().toISOString().split('T')[0];
        const groupedForecast = processedForecast.reduce((acc, entry) => {
          // Pula se for o dia atual
          if (entry.date === today) {
            return acc;
          }

          if (
            !acc[entry.date] ||
            new Date(entry.date + ' ' + entry.time) >
              new Date(acc[entry.date].date + ' ' + acc[entry.date].time)
          ) {
            acc[entry.date] = entry;
          }
          return acc;
        }, {});

        setWeatherData({
          history: historyData,
          forecast: Object.values(groupedForecast),
        });

        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados do clima:', err);
        setError('Erro ao carregar dados do clima');
        setLoading(false);
      }
    };

    if (selectedProject) {
      fetchWeatherData();
    }
  }, [selectedProject]);

  const renderWeatherTable = (data, title) => (
    <Card className="bg-white flex-1">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Data</TableHead>
              <TableHead className="whitespace-nowrap">Condições</TableHead>
              <TableHead className="whitespace-nowrap">Temperatura</TableHead>
              <TableHead className="whitespace-nowrap">Chuva</TableHead>
              <TableHead className="whitespace-nowrap">Umidade</TableHead>
              <TableHead className="whitespace-nowrap">Vento</TableHead>
              <TableHead className="whitespace-nowrap">Impacto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((log) => (
              <TableRow key={`${log.date}-${log.time}`}>
                <TableCell className="whitespace-nowrap">
                  {new Date(log.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <WeatherIcon conditions={log.conditions} />
                    <span className="capitalize text-xs sm:text-sm">
                      {log.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {log.temperature}°C
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {log.rainfall > 0 ? `${log.rainfall.toFixed(1)}mm` : '0mm'}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {log.humidity}%
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {log.windSpeed} km/h
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkImpactClass(
                      log.workImpact
                    )}`}
                  >
                    {getWorkImpactText(log.workImpact)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500">Carregando dados do clima...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-48">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Nome da cidade */}
      <div className="flex items-center gap-2 px-4 sm:px-0">
        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
        <span className="text-xl sm:text-2xl font-semibold text-gray-800">
          {city}
        </span>
      </div>

      {/* Legenda de Impactos */}
      <Card className="bg-white w-full sm:w-3/4 md:w-1/2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Info className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Legenda de Impactos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium text-center min-w-[90px] ${getWorkImpactClass(
                  'none'
                )}`}
              >
                Sem Impacto
              </span>
              <span className="text-xs sm:text-sm text-gray-600">{`< 5mm de chuva`}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium text-center min-w-[100px] ${getWorkImpactClass(
                  'partial'
                )}`}
              >
                Impacto Parcial
              </span>
              <span className="text-xs sm:text-sm text-gray-600">
                5mm a 10mm de chuva
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium text-center min-w-[110px] ${getWorkImpactClass(
                  'full'
                )}`}
              >
                Paralisação Total
              </span>
              <span className="text-xs sm:text-sm text-gray-600">{`> 10mm de chuva`}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabelas lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {renderWeatherTable(
          weatherData.history,
          'Registros dos Últimos 5 Dias'
        )}
        {renderWeatherTable(
          weatherData.forecast,
          'Previsão para os Próximos Dias'
        )}
      </div>
    </div>
  );
};

export default WeatherLog;
