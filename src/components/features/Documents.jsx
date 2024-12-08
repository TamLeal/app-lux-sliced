/**
 * @fileoverview Documents
 *
 * @description
 * Componente que gerencia e exibe os documentos do projeto,
 * organizados por categorias
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Table
 * - @/components/ui/Button
 * - lucide-react (ícones)
 *
 * @relatedFiles
 * - Projects.jsx
 * - DocumentForm.jsx
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { FileText, Upload, Download, Edit, Trash2 } from 'lucide-react';

function Documents({
  documents,
  onAddDocument,
  onEditDocument,
  onRemoveDocument,
  onDownloadDocument,
}) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documentação
            </span>
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white"
              onClick={onAddDocument}
            >
              <Upload className="h-4 w-4 mr-2" />
              Novo Documento
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((category, index) => (
              <Card key={index} className="mb-6 last:mb-0 bg-white shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold mb-4">
                    {category.type}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-2 py-1">Documento</TableHead>
                        <TableHead className="px-2 py-1">Status</TableHead>
                        <TableHead className="px-2 py-1">Validade</TableHead>
                        <TableHead className="px-2 py-1">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.items.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="px-2 py-1">
                            {doc.name}
                          </TableCell>
                          <TableCell className="px-2 py-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                doc.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : doc.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {doc.status === 'approved'
                                ? 'Aprovado'
                                : doc.status === 'pending'
                                ? 'Pendente'
                                : 'Expirado'}
                            </span>
                          </TableCell>
                          <TableCell className="px-2 py-1">
                            {doc.expiryDate
                              ? new Date(doc.expiryDate).toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="px-2 py-1">
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDownloadDocument(doc)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  onEditDocument(category.type, doc)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() =>
                                  onRemoveDocument(category.type, doc.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Documents;
