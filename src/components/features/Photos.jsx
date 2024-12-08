/**
 * @fileoverview Photos
 *
 * @description
 * Componente que gerencia e exibe as fotos do projeto,
 * incluindo visualização em grid e funcionalidades de upload
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Button
 * - lucide-react (ícones)
 *
 * @relatedFiles
 * - Projects.jsx
 * - PhotoUploadForm.jsx
 * - useDrawing.js
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Camera, Plus, Trash2 } from 'lucide-react';

function Photos({ photos, onAddPhoto, onRemovePhoto }) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Fotos da Obra
            </span>
            <Button
              onClick={onAddPhoto}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Foto
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden bg-white">
                <div className="relative h-48">
                  <img
                    src={photo.url}
                    alt={photo.description}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay com gradiente para melhor legibilidade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 right-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-black/20"
                        onClick={() => onRemovePhoto(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="font-medium text-gray-800 line-clamp-2">
                      {photo.description}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{photo.location}</span>
                      <span>{new Date(photo.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mensagem quando não há fotos */}
          {photos.length === 0 && (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                Nenhuma foto adicionada ainda.
                <br />
                Clique em "Nova Foto" para começar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginação - opcional */}
      {photos.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            className="text-gray-600"
            disabled={photos.length < 12} // Exemplo de limite por página
          >
            Carregar mais fotos
          </Button>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para preview de imagem
const ImagePreview = ({ src, alt }) => {
  return (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className="w-full h-48 object-cover rounded transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded" />
    </div>
  );
};

export default Photos;
