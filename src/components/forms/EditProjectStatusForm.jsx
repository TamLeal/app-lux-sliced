import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { projectStatuses } from '@/utils/constants';

function EditProjectStatusForm({ project, onSubmit, onCancel }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newStatus = form.status.value;
    onSubmit(newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Editar Status da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <select
                name="status"
                defaultValue={project.status || 'planning'}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {projectStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditProjectStatusForm;