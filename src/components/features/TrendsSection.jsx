import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  Area,
  AreaChart,
} from 'recharts';

// Mock data - em produção viria da API/backend
const trendData = [
  {
    month: 'Jan',
    progress: 15,
    planned: 20,
    spending: 150000,
    plannedSpending: 180000,
    productivity: 82,
  },
  {
    month: 'Fev',
    progress: 35,
    planned: 40,
    spending: 320000,
    plannedSpending: 350000,
    productivity: 88,
  },
  {
    month: 'Mar',
    progress: 52,
    planned: 55,
    spending: 480000,
    plannedSpending: 500000,
    productivity: 85,
  },
  {
    month: 'Abr',
    progress: 68,
    planned: 70,
    spending: 650000,
    plannedSpending: 680000,
    productivity: 92,
  },
  {
    month: 'Mai',
    progress: 75,
    planned: 80,
    spending: 800000,
    plannedSpending: 820000,
    productivity: 89,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
        <p className="font-bold text-gray-800">{label}</p>
        {payload.map((item, index) => (
          <p key={index} style={{ color: item.color }}>
            {item.name}: {item.value}
            {item.name.includes('progress')
              ? '%'
              : item.name.includes('spending')
              ? ` R$`
              : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TrendsSection = () => {
  return (
    <div className="space-y-6">
      {/* Progresso x Planejado */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Evolução do Progresso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#3b82f6"
                  name="Progresso Real"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="#9ca3af"
                  name="Progresso Planejado"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gastos x Planejado */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Gastos vs Planejado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="spending" fill="#22c55e" name="Gasto Real" />
                <Bar
                  dataKey="plannedSpending"
                  fill="#86efac"
                  name="Gasto Planejado"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Produtividade */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Índice de Produtividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="productivity"
                  stroke="#8b5cf6"
                  fill="#c4b5fd"
                  name="Produtividade"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsSection;
