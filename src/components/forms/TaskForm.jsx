/**
 * @fileoverview TaskForm
 *
 * @description
 * Formulário para criação e edição de tarefas dentro das fases do projeto
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Label
 * - @/components/ui/Input
 * - @/components/ui/Button
 *
 * @relatedFiles
 * - Projects.jsx (componente pai)
 * - Timeline.jsx (componente relacionado)
 * - TimelineForm.jsx (componente relacionado)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function TaskForm({ onSubmit, onCancel, newTask, setNewTask }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle>{newTask.id ? 'Editar Tarefa' : 'Nova Tarefa'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="taskName">Nome da Tarefa</Label>
              <Input
                id="taskName"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="taskStatus">Status</Label>
              <select
                id="taskStatus"
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-2 py-1"
                required
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Progresso</option>
                <option value="completed">Concluída</option>
              </select>
            </div>
            <div>
              <Label htmlFor="taskProgress">Progresso (%)</Label>
              <Input
                id="taskProgress"
                type="number"
                min="0"
                max="100"
                value={newTask.progress}
                onChange={(e) =>
                  setNewTask({ ...newTask, progress: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskForm;
