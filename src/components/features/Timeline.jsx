/**
 * @fileoverview Timeline
 *
 * @description
 * Componente que gerencia e exibe a timeline do projeto, incluindo fases,
 * marcos e tarefas
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Progress
 * - @/components/ui/Button
 * - lucide-react (ícones)
 *
 * @relatedFiles
 * - Projects.jsx
 * - TimelineForm.jsx
 * - MilestoneForm.jsx
 * - TaskForm.jsx
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Plus, Edit, Trash2, Clock, Calendar, CheckSquare } from 'lucide-react';
import { calculatePhaseProgress } from '@/utils/projectUtils';

function Timeline({
  phases,
  onAddPhase,
  onEditPhase,
  onRemovePhase,
  onAddMilestone,
  onEditMilestone,
  onRemoveMilestone,
  onAddTask,
  onEditTask,
  onRemoveTask,
}) {
  return (
    <div className="space-y-6">
      <Button
        onClick={onAddPhase}
        className="bg-teal-500 hover:bg-teal-600 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nova Fase
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {phase.phase}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPhase(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => onRemovePhase(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Início: {new Date(phase.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    Término: {new Date(phase.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="text-sm text-gray-600">Progresso</span>
                  <div className="flex items-center mt-1">
                    <Progress value={phase.progress} className="flex-1" />
                    <span className="ml-2 text-sm font-semibold text-gray-700">
                      {phase.progress}%
                    </span>
                  </div>
                </div>

                {/* Seção de Marcos */}
                <div>
                  <h4 className="font-medium mb-2">Marcos</h4>
                  {phase.milestones.map((milestone) => (
                    <div key={milestone.id} className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          <div className="text-sm">
                            <p className="font-medium">
                              {milestone.description}
                            </p>
                            <p className="text-gray-500">
                              {new Date(milestone.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditMilestone(index, milestone.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() =>
                              onRemoveMilestone(index, milestone.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddMilestone(index)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Marco
                  </Button>
                </div>

                {/* Seção de Tarefas */}
                <div>
                  <h5 className="font-medium mb-1">Tarefas</h5>
                  {phase.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between mb-1"
                    >
                      <div className="flex items-center">
                        <CheckSquare
                          className={`h-4 w-4 mr-2 ${
                            task.progress >= 80
                              ? 'text-green-500'
                              : task.progress >= 50
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                        />
                        <span className="text-sm">{task.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.progress >= 80
                              ? 'bg-green-100 text-green-800'
                              : task.progress >= 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {task.progress}%
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditTask(index, task.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => onRemoveTask(index, task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddTask(index)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Tarefa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
