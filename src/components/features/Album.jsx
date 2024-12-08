import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Building,
  Upload,
  Image as ImageIcon,
  Edit,
  Save,
  Trash2,
  Download,
  Pencil,
  MousePointer,
  ArrowRight,
  Plus,
} from 'lucide-react';

export default function Album({ data }) {
  const [activeProject, setActiveProject] = useState('overview');
  const [selectedTool, setSelectedTool] = useState('pen'); // pen, arrow
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentColor, setCurrentColor] = useState('#FF0000'); // Cor padrão vermelha
  const [currentWidth, setCurrentWidth] = useState(2); // Espessura padrão do traço
  const [imageDescription, setImageDescription] = useState('');
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const lastPointRef = useRef(null);

  // Mock data dos projetos
  // Mock data dos projetos
  const projects = [
    {
      id: 1,
      name: 'Edifício Horizonte',
      images: [
        {
          id: 1,
          url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Fundação+Concluída',
          description: 'Fundação concluída',
          date: '2024-01-20',
          annotations: [],
        },
        {
          id: 2,
          url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Estrutura+1º+Andar',
          description: 'Estrutura do 1º andar',
          date: '2024-02-15',
          annotations: [],
        },
      ],
    },
    {
      id: 2,
      name: 'Residencial Parque Verde',
      images: [
        {
          id: 3,
          url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Preparação+do+Terreno',
          description: 'Preparação do terreno',
          date: '2024-02-01',
          annotations: [],
        },
        {
          id: 4,
          url: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Início+da+Fundação',
          description: 'Início da fundação',
          date: '2024-03-10',
          annotations: [],
        },
      ],
    },
  ];

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.strokeStyle = currentColor;
      context.lineWidth = currentWidth;
      contextRef.current = context;
    }
  }, [currentImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setCurrentImage(img);
          // Redimensionar canvas para corresponder à imagem
          if (canvasRef.current) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            // Desenhar imagem no canvas
            contextRef.current.drawImage(img, 0, 0, img.width, img.height);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    lastPointRef.current = { x: offsetX, y: offsetY };
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;

    if (selectedTool === 'pen') {
      context.beginPath();
      context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      context.lineTo(offsetX, offsetY);
      context.stroke();
      lastPointRef.current = { x: offsetX, y: offsetY };
    } else if (selectedTool === 'arrow' && lastPointRef.current) {
      // Limpar o canvas e redesenhar a imagem
      const canvas = canvasRef.current;
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (currentImage) {
        context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
      }

      // Desenhar a seta
      drawArrow(
        context,
        lastPointRef.current.x,
        lastPointRef.current.y,
        offsetX,
        offsetY
      );
    }
  };

  const drawArrow = (context, fromX, fromY, toX, toY) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    // Desenhar a linha
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();

    // Desenhar a ponta da seta
    context.beginPath();
    context.moveTo(toX, toY);
    context.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(toX, toY);
    context.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveAnnotation = () => {
    if (!canvasRef.current || !imageDescription) return;

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    // Aqui você pode implementar a lógica para salvar a imagem com anotações
    console.log('Salvando imagem com anotações:', imageData);
    console.log('Descrição:', imageDescription);
  };

  const renderProjectContent = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    return (
      <div className="space-y-6">
        {/* Área de Upload e Anotação */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Adicionar Nova Foto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Selecionar Imagem</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border-gray-300"
                />
              </div>

              {currentImage && (
                <>
                  <div className="space-y-4">
                    <Label>Ferramentas de Anotação</Label>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedTool('pen')}
                        className={`${
                          selectedTool === 'pen'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Caneta
                      </Button>
                      <Button
                        onClick={() => setSelectedTool('arrow')}
                        className={`${
                          selectedTool === 'arrow'
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Seta
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="color">Cor:</Label>
                        <input
                          type="color"
                          id="color"
                          value={currentColor}
                          onChange={(e) => setCurrentColor(e.target.value)}
                          className="w-8 h-8 rounded"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="width">Espessura:</Label>
                        <input
                          type="range"
                          id="width"
                          min="1"
                          max="10"
                          value={currentWidth}
                          onChange={(e) =>
                            setCurrentWidth(parseInt(e.target.value))
                          }
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        className="w-full h-96 object-contain"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição da Foto</Label>
                      <Input
                        id="description"
                        value={imageDescription}
                        onChange={(e) => setImageDescription(e.target.value)}
                        placeholder="Descreva o que a foto mostra..."
                        className="border-gray-300"
                      />
                    </div>

                    <Button
                      onClick={saveAnnotation}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Imagem
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Galeria de Fotos */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Galeria de Fotos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.description}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <p className="font-medium text-gray-800">
                      {image.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(image.date).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => setActiveProject(project.id)}
        >
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              {project.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {project.images.slice(0, 2).map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.description}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-gray-600">{project.images.length} fotos</p>
                <Button
                  className="mt-2 bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={() => setActiveProject(project.id)}
                >
                  Ver Galeria Completa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Álbum da Obra</h2>

      {/* Navegação por Abas */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          <Button
            onClick={() => setActiveProject('overview')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 ${
              activeProject === 'overview'
                ? 'bg-white text-teal-600 border-b-2 border-teal-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building className="h-4 w-4 mr-2 inline-block" />
            Visão Geral
          </Button>
          {projects.map((project) => (
            <Button
              key={project.id}
              onClick={() => setActiveProject(project.id)}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 ${
                activeProject === project.id
                  ? 'bg-white text-teal-600 border-b-2 border-teal-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {project.name}
            </Button>
          ))}
        </nav>
      </div>

      {/* Conteúdo da Aba Selecionada */}
      {activeProject === 'overview'
        ? renderOverview()
        : renderProjectContent(activeProject)}
    </>
  );
}
