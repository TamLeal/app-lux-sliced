/**
 * @fileoverview constants
 *
 * @description
 * Constantes utilizadas em todo o projeto
 *
 * @relatedFiles
 * - Todos os componentes que precisam de dados constantes
 */

// Tipos de construção
export const constructionTypes = [
  { value: 'residential', label: 'Residencial' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'mixed', label: 'Uso Misto' },
];

// Status dos projetos
export const projectStatuses = [
  { value: 'planning', label: 'Em Planejamento' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'on_hold', label: 'Pausado' },
  { value: 'completed', label: 'Concluído' },
];

// Tipos de documentos
export const documentTypes = [
  { value: 'Projeto', label: 'Projeto' },
  { value: 'Licenças', label: 'Licenças' },
  { value: 'Relatórios', label: 'Relatórios' },
  { value: 'Contratos', label: 'Contratos' },
  { value: 'Outros', label: 'Outros' },
];

// Tabs de navegação
export const TABS = {
  OVERVIEW: 'overview',
  TIMELINE: 'timeline',
  WEATHER: 'weather',
  DOCUMENTS: 'documents',
  PHOTOS: 'photos',
};

// Status das tarefas
export const taskStatuses = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'completed', label: 'Concluída' },
];

// Status dos documentos
export const documentStatuses = [
  { value: 'pending', label: 'Pendente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'expired', label: 'Expirado' },
];

// Configurações de clima
export const weatherConfig = {
  apiKey: 'bc656b9222f7f091184dccaa5d217f50',
  city: 'Pouso Alegre',
  countryCode: 'BR',
};

// Configurações padrão do canvas
export const canvasConfig = {
  defaultColor: '#FF0000',
  defaultWidth: 2,
  tools: ['pen', 'arrow'],
};
