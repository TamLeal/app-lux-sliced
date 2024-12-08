/**
 * @fileoverview EditProjectStatusForm
 *
 * @description
 * Formulário para edição rápida do status do projeto
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Label
 * - @/components/ui/Button
 * - constants.js (status do projeto)
 *
 * @relatedFiles
 * - Projects.jsx (componente pai)
 * - ProjectCard.jsx (componente relacionado)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { projectStatuses } from '@/utils/constants';

function EditProjectStatusForm({ project, setProject, onSubmit, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Editar Status da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="projectStatus">Status</Label>
              <select
                id="projectStatus"
                value={project.status}
                onChange={(e) =>
                  setProject({ ...project, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-2 py-1"
                required
              >
                {projectStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
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

export default EditProjectStatusForm;
