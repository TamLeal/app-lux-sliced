import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Edit, Building, Trash2, Home } from 'lucide-react';
import { getStatusColor } from '@/utils/projectUtils';
import { projectStatuses } from '@/utils/constants';

function ProjectCard({
  project,
  onSelect,
  onEditName,
  onEditStatus,
  onDelete,
}) {
  const getStatusLabel = (statusValue) => {
    const status = projectStatuses.find(s => s.value === statusValue);
    return status ? status.label : 'Em Planejamento';
  };

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 flex justify-between items-center">
          <div className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            {project.name}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditName(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStatus(project)}
            >
              <Building className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                {getStatusLabel(project.status)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Progresso Geral</p>
            <div className="flex items-center mt-1">
              <Progress value={project.progress} className="flex-1" />
              <span className="ml-2 text-sm font-semibold text-gray-700">
                {project.progress}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Início</p>
              <p className="font-medium">
                {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Término Previsto</p>
              <p className="font-medium">
                {new Date(project.estimatedEndDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Button
            onClick={() => onSelect(project)}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;