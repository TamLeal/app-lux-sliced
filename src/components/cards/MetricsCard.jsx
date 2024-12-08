/**
 * @fileoverview MetricsCard
 *
 * @description
 * Cards que exibem as métricas principais do projeto no dashboard,
 * incluindo progresso, orçamento, tempo e status
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Progress
 * - lucide-react (ícones)
 *
 * @relatedFiles
 * - Projects.jsx (componente pai)
 * - Overview.jsx (componente relacionado)
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { CheckSquare, DollarSign, Clock, Building } from 'lucide-react';

function MetricsCard({
  type,
  title,
  value,
  icon: Icon,
  color,
  showProgress = true,
}) {
  const getBgColor = () => {
    const colors = {
      progress: 'bg-blue-50',
      budget: 'bg-green-50',
      time: 'bg-yellow-50',
      status: 'bg-purple-50',
    };
    return colors[type] || 'bg-gray-50';
  };

  const getIconBgColor = () => {
    const colors = {
      progress: 'bg-blue-100',
      budget: 'bg-green-100',
      time: 'bg-yellow-100',
      status: 'bg-purple-100',
    };
    return colors[type] || 'bg-gray-100';
  };

  const getIconColor = () => {
    const colors = {
      progress: 'text-blue-600',
      budget: 'text-green-600',
      time: 'text-yellow-600',
      status: 'text-purple-600',
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <Card className={`${getBgColor()} min-h-[8rem]`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2 ${getIconBgColor()} rounded-full`}>
            <Icon className={`h-6 w-6 ${getIconColor()}`} />
          </div>
        </div>
        {showProgress && (
          <div className="mt-2">
            <Progress
              value={typeof value === 'string' ? parseFloat(value) : value}
              className="w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componentes específicos pré-configurados
export const ProgressMetricsCard = (props) => (
  <MetricsCard type="progress" icon={CheckSquare} {...props} />
);

export const BudgetMetricsCard = (props) => (
  <MetricsCard type="budget" icon={DollarSign} {...props} />
);

export const TimeMetricsCard = (props) => (
  <MetricsCard type="time" icon={Clock} {...props} />
);

export const StatusMetricsCard = (props) => (
  <MetricsCard type="status" icon={Building} showProgress={false} {...props} />
);

export default MetricsCard;
