/**
 * @fileoverview TimelineForm
 *
 * @description
 * Formulário para criação e edição de fases no timeline do projeto
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
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function TimelineForm({ onSubmit, onCancel, newTimeline, setNewTimeline }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-xl h-fit max-h-[90vh] overflow-y-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle>{newTimeline.id ? 'Editar Fase' : 'Nova Fase'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phase">Nome da Fase</Label>
              <Input
                id="phase"
                value={newTimeline.phase}
                onChange={(e) =>
                  setNewTimeline({ ...newTimeline, phase: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newTimeline.startDate}
                  onChange={(e) =>
                    setNewTimeline({
                      ...newTimeline,
                      startDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newTimeline.endDate}
                  onChange={(e) =>
                    setNewTimeline({ ...newTimeline, endDate: e.target.value })
                  }
                  required
                />
              </div>
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

export default TimelineForm;
