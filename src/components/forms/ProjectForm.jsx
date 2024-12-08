/**
 * @fileoverview ProjectForm
 *
 * @description
 * Formulário para criação de novo projeto de construção
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Label
 * - @/components/ui/Input
 * - @/components/ui/Button
 *
 * @relatedFiles
 * - Projects.jsx (componente pai)
 * - constants.js (tipos de construção e status)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { constructionTypes, projectStatuses } from '@/utils/constants';

function ProjectForm({ onSubmit, onCancel, newProject, setNewProject }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Nova Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Obra</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="constructionType">Tipo de Construção</Label>
                <select
                  id="constructionType"
                  value={newProject.constructionType}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      constructionType: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {constructionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={newProject.address}
                  onChange={(e) =>
                    setNewProject({ ...newProject, address: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="responsibleEngineer">
                  Engenheiro Responsável
                </Label>
                <Input
                  id="responsibleEngineer"
                  value={newProject.responsibleEngineer}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      responsibleEngineer: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="estimatedEndDate">Previsão de Término</Label>
                <Input
                  id="estimatedEndDate"
                  type="date"
                  value={newProject.estimatedEndDate}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      estimatedEndDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="totalArea">Área Total (m²)</Label>
                <Input
                  id="totalArea"
                  type="number"
                  value={newProject.totalArea}
                  onChange={(e) =>
                    setNewProject({ ...newProject, totalArea: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="numberOfUnits">Número de Unidades</Label>
                <Input
                  id="numberOfUnits"
                  type="number"
                  value={newProject.numberOfUnits}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      numberOfUnits: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="budget">Orçamento Previsto (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newProject.budget}
                  onChange={(e) =>
                    setNewProject({ ...newProject, budget: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({ ...newProject, status: e.target.value })
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
            </div>

            <div>
              <Label htmlFor="description">Descrição do Projeto</Label>
              <textarea
                id="description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 h-32"
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

export default ProjectForm;
