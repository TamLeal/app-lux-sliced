/**
 * @fileoverview EditProjectNameForm
 *
 * @description
 * Formulário para edição rápida do nome do projeto
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Label
 * - @/components/ui/Input
 * - @/components/ui/Button
 *
 * @relatedFiles
 * - Projects.jsx (componente pai)
 * - ProjectCard.jsx (componente relacionado)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function EditProjectNameForm({ project, setProject, onSubmit, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Editar Nome da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="projectName">Nome da Obra</Label>
              <Input
                id="projectName"
                value={project.name}
                onChange={(e) =>
                  setProject({ ...project, name: e.target.value })
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

export default EditProjectNameForm;
