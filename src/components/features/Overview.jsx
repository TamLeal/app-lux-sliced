import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Edit } from 'lucide-react';
import {
  ProgressMetricsCard,
  BudgetMetricsCard,
  TimeMetricsCard,
  StatusMetricsCard,
} from '@/components/cards/MetricsCard';
import WeatherCard from '@/components/ui/WeatherCard';
import {
  calculateElapsedTime,
  formatCurrency,
  formatDate,
  getStatusText,
} from '@/utils/projectUtils';

function Overview({
  project,
  weatherData,
  forecastData,
  weatherLoading,
  weatherError,
  onEditDetails,
}) {
  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ProgressMetricsCard
          title="Progresso Geral"
          value={`${project?.progress || 0}%`}
        />

        <BudgetMetricsCard
          title="Orçamento Utilizado"
          value={`${((project?.spent || 0) / (project?.budget || 1) * 100).toFixed(1)}%`}
        />

        <TimeMetricsCard
          title="Tempo Decorrido"
          value={`${calculateElapsedTime(project) || 0}%`}
        />

        <StatusMetricsCard 
          title="Status" 
          value={getStatusText(project?.status)}
        />

        {/* Card do Clima */}
        {weatherLoading ? (
          <Card className="bg-blue-50">
            <CardContent className="p-4 flex items-center justify-center">
              <p className="text-gray-600">Carregando...</p>
            </CardContent>
          </Card>
        ) : weatherError ? (
          <Card className="bg-red-50">
            <CardContent className="p-4 flex items-center justify-center">
              <p className="text-red-600">{weatherError}</p>
            </CardContent>
          </Card>
        ) : (
          <WeatherCard weather={weatherData} forecast={forecastData} />
        )}
      </div>

      {/* Informações detalhadas e Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Gerais */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Informações Gerais</CardTitle>
            <Button variant="ghost" size="sm" onClick={onEditDetails}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome da Obra</Label>
                <p className="text-gray-700">{project?.name}</p>
              </div>
              <div>
                <Label>Endereço</Label>
                <p className="text-gray-700">{project?.address}</p>
              </div>
              <div>
                <Label>Descrição do Projeto</Label>
                <p className="text-gray-700">{project?.description}</p>
              </div>
              <div>
                <Label>Tipo de Construção</Label>
                <p className="text-gray-700">{project?.constructionType}</p>
              </div>
              <div>
                <Label>Área Total</Label>
                <p className="text-gray-700">{project?.totalArea || 0} m²</p>
              </div>
              <div>
                <Label>Unidades</Label>
                <p className="text-gray-700">{project?.numberOfUnits || 0}</p>
              </div>
              <div>
                <Label>Engenheiro Responsável</Label>
                <p className="text-gray-700">{project?.responsibleEngineer}</p>
              </div>
              <div>
                <Label>Data de Início</Label>
                <p className="text-gray-700">{project?.startDate ? formatDate(project.startDate) : 'Não definida'}</p>
              </div>
              <div>
                <Label>Previsão de Término</Label>
                <p className="text-gray-700">
                  {project?.estimatedEndDate ? formatDate(project.estimatedEndDate) : 'Não definida'}
                </p>
              </div>
              <div>
                <Label>Orçamento Previsto</Label>
                <p className="text-gray-700">
                  {formatCurrency(project?.budget || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo da Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project?.timeline?.slice(0, 3)?.map((phase, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">{phase.phase}</p>
                    <p className="text-sm text-gray-500">
                      {phase.progress}% concluído
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Progress value={phase.progress} className="w-24" />
                    <span className="ml-2 text-sm font-semibold text-gray-700">
                      {phase.progress}%
                    </span>
                  </div>
                </div>
              ))}

              {(!project?.timeline || project.timeline.length === 0) && (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma fase registrada ainda.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Overview;