/**
 * @fileoverview PhotoUploadForm
 *
 * @description
 * Formulário para upload e edição de fotos do projeto, incluindo funcionalidades
 * de desenho e anotações sobre as imagens
 *
 * @dependencies
 * - @/components/ui/Card
 * - @/components/ui/Label
 * - @/components/ui/Input
 * - @/components/ui/Button
 *
 * @relatedFiles
 * - Projects.jsx (componente pai)
 * - Photos.jsx (componente relacionado)
 * - useDrawing.js (hook para canvas)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function PhotoUploadForm({
  onSubmit,
  onCancel,
  newPhoto,
  setNewPhoto,
  handlePhotoSelect,
  canvasRef,
  startDrawing,
  draw,
  stopDrawing,
  selectedTool,
  setSelectedTool,
  currentColor,
  setCurrentColor,
  currentWidth,
  setCurrentWidth,
  currentImage,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <Card className="w-full max-w-2xl h-fit max-h-[90vh] overflow-y-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Nova Foto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="photoFile">Selecionar Foto</Label>
              <Input
                id="photoFile"
                type="file"
                onChange={handlePhotoSelect}
                required
              />
            </div>

            {currentImage && (
              <>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={selectedTool === 'pen' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('pen')}
                  >
                    Caneta
                  </Button>
                  <Button
                    variant={selectedTool === 'arrow' ? 'default' : 'outline'}
                    onClick={() => setSelectedTool('arrow')}
                  >
                    Seta
                  </Button>
                  <Input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                  />
                  <Input
                    type="number"
                    value={currentWidth}
                    onChange={(e) => setCurrentWidth(e.target.value)}
                    min="1"
                    max="10"
                  />
                </div>
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border mt-2"
                  style={{ width: '100%', height: '400px' }}
                />
              </>
            )}

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newPhoto.description}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={newPhoto.location}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, location: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={newPhoto.date}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, date: e.target.value })
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

export default PhotoUploadForm;
