/**
 * @fileoverview DocumentForm
 *
 * @description
 * Formulário para upload e edição de documentos do projeto
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Label
 * - @/components/ui/Input
 * - @/components/ui/Button
 *
 * @relatedFiles
 * - Projects.jsx (componente pai)
 * - Documents.jsx (componente relacionado)
 * - constants.js (tipos de documentos)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { documentTypes } from '../utils/constants';

function DocumentForm({ onSubmit, onCancel, newDocument, setNewDocument }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle>
            {newDocument.id ? 'Editar Documento' : 'Novo Documento'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <select
                id="documentType"
                value={newDocument.type}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-2 py-1"
                required
              >
                <option value="">Selecione o tipo</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="documentName">Nome do Documento</Label>
              <Input
                id="documentName"
                value={newDocument.name}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="documentStatus">Status</Label>
              <select
                id="documentStatus"
                value={newDocument.status}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-2 py-1"
                required
              >
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="expired">Expirado</option>
              </select>
            </div>
            <div>
              <Label htmlFor="expiryDate">Data de Validade (opcional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={newDocument.expiryDate}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, expiryDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="documentFile">Arquivo</Label>
              <Input
                id="documentFile"
                type="file"
                onChange={(e) =>
                  setNewDocument({ ...newDocument, file: e.target.files[0] })
                }
                required={!newDocument.fileData}
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

export default DocumentForm;
