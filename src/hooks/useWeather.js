/**
 * @fileoverview useWeather
 *
 * @description
 * Hook customizado para gerenciar chamadas à API de clima e
 * manipulação dos dados meteorológicos
 *
 * @dependencies
 * - axios
 *
 * @relatedFiles
 * - WeatherCard.jsx
 * - WeatherLog.jsx
 * - constants.js
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { weatherConfig } from '../utils/constants';

const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // Chamada para o clima atual
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${weatherConfig.city},${weatherConfig.countryCode}&units=metric&lang=pt_br&appid=${weatherConfig.apiKey}`
      );

      // Chamada para a previsão de 5 dias
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${weatherConfig.city},${weatherConfig.countryCode}&units=metric&lang=pt_br&appid=${weatherConfig.apiKey}`
      );

      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados do clima:', error);
      setError('Erro ao carregar dados do clima');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  // Função para processar dados do clima para o registro
  const processWeatherDataForLog = (data) => {
    if (!data) return null;

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      conditions: data.weather[0].description,
      timestamp: new Date().toISOString(),
    };
  };

  // Função para atualizar manualmente os dados
  const refreshWeather = () => {
    fetchWeather();
  };

  return {
    weatherData,
    forecastData,
    loading,
    error,
    refreshWeather,
    processWeatherDataForLog,
  };
};

export default useWeather;
