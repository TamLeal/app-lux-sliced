/**
 * @fileoverview useDrawing
 *
 * @description
 * Hook customizado para gerenciar funcionalidades de desenho em canvas,
 * utilizado para anotações em fotos do projeto
 *
 * @dependencies
 * - canvasConfig from constants.js
 *
 * @relatedFiles
 * - PhotoUploadForm.jsx
 * - Photos.jsx
 */

import { useState, useRef, useEffect } from 'react';
import { canvasConfig } from '../utils/constants';

const useDrawing = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedTool, setSelectedTool] = useState('pen');
  const [currentColor, setCurrentColor] = useState(canvasConfig.defaultColor);
  const [currentWidth, setCurrentWidth] = useState(canvasConfig.defaultWidth);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const lastPointRef = useRef(null);

  // Inicializa o canvas quando a imagem muda
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

      if (currentImage) {
        context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [currentImage, currentColor, currentWidth]);

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
      const canvas = canvasRef.current;
      // Limpa o canvas mantendo a imagem de fundo
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (currentImage) {
        context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
      }
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

    // Desenha a linha
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();

    // Desenha a ponta da seta
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (currentImage) {
      context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    }
  };

  const handleImageLoad = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setCurrentImage(img);
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const getCanvasImage = () => {
    if (canvasRef.current) {
      return canvasRef.current.toDataURL('image/png');
    }
    return null;
  };

  return {
    canvasRef,
    isDrawing,
    currentImage,
    selectedTool,
    currentColor,
    currentWidth,
    setSelectedTool,
    setCurrentColor,
    setCurrentWidth,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    handleImageLoad,
    getCanvasImage,
  };
};

export default useDrawing;
