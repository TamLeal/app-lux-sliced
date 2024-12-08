/**
 * @fileoverview EditProjectDetailsForm
 *
 * @description
 * Formulário para edição dos detalhes de um projeto existente
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

function EditProjectDetailsForm({ project, setProject, onSubmit, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Editar Informações da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome da Obra</Label>
                <Input
                  id="name"
                  value={project.name}
                  onChange={(e) =>
                    setProject({ ...project, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="constructionType">Tipo de Construção</Label>
                <select
                  id="constructionType"
                  value={project.constructionType}
                  onChange={(e) =>
                    setProject({ ...project, constructionType: e.target.value })
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
                  value={project.address}
                  onChange={(e) =>
                    setProject({ ...project, address: e.target.value })
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
                  value={project.responsibleEngineer}
                  onChange={(e) =>
                    setProject({
                      ...project,
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
                  value={project.startDate}
                  onChange={(e) =>
                    setProject({ ...project, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="estimatedEndDate">Previsão de Término</Label>
                <Input
                  id="estimatedEndDate"
                  type="date"
                  value={project.estimatedEndDate}
                  onChange={(e) =>
                    setProject({ ...project, estimatedEndDate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="totalArea">Área Total (m²)</Label>
                <Input
                  id="totalArea"
                  type="number"
                  value={project.totalArea}
                  onChange={(e) =>
                    setProject({ ...project, totalArea: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="numberOfUnits">Número de Unidades</Label>
                <Input
                  id="numberOfUnits"
                  type="number"
                  value={project.numberOfUnits}
                  onChange={(e) =>
                    setProject({ ...project, numberOfUnits: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="budget">Orçamento Previsto (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={project.budget}
                  onChange={(e) =>
                    setProject({ ...project, budget: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
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
            </div>

            <div>
              <Label htmlFor="description">Descrição do Projeto</Label>
              <textarea
                id="description"
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
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

export default EditProjectDetailsForm;
