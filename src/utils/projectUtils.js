/**
 * @fileoverview projectUtils
 *
 * @description
 * Funções utilitárias para cálculos e formatações relacionadas aos projetos
 *
 * @relatedFiles
 * - Projects.jsx
 * - ProjectCard.jsx
 * - Overview.jsx
 */

// Função para obter cor do status do projeto
export const getStatusColor = (status) => {
  const colors = {
    planning: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-green-100 text-green-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Função para obter texto do status do projeto
export const getStatusText = (status) => {
  const statusTextMap = {
    planning: 'Planning',
    in_progress: 'In Progress',
    on_hold: 'On Hold',
    completed: 'Completed',
  };
  return statusTextMap[status] || 'Unknown Status';
};

// Função para calcular o tempo decorrido do projeto
export const calculateElapsedTime = (project) => {
  const start = new Date(project.startDate);
  const end = new Date(project.estimatedEndDate);
  const now = new Date();

  if (now < start) return 0;
  if (now > end) return 100;

  const totalDuration = end - start;
  const elapsed = now - start;

  return ((elapsed / totalDuration) * 100).toFixed(2);
};

// Função para calcular o progresso geral do projeto
export const calculateOverallProgress = (project) => {
  if (!project.timeline || project.timeline.length === 0) return 0;

  const totalProgress = project.timeline.reduce(
    (acc, phase) => acc + parseFloat(phase.progress),
    0
  );
  return (totalProgress / project.timeline.length).toFixed(2);
};

// Função para calcular o progresso de uma fase
export const calculatePhaseProgress = (phase) => {
  if (!phase.tasks || phase.tasks.length === 0) return 0;

  const totalProgress = phase.tasks.reduce(
    (acc, task) => acc + parseFloat(task.progress),
    0
  );
  return (totalProgress / phase.tasks.length).toFixed(2);
};

// Função para formatar valores monetários
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Função para formatar datas
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

// Função para calcular status do orçamento
export const calculateBudgetStatus = (spent, budget) => {
  const percentage = (spent / budget) * 100;
  if (percentage > 100) return 'exceeded';
  if (percentage > 90) return 'warning';
  return 'normal';
};

// Função para validar datas do projeto
export const validateProjectDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

// Função para gerar relatório resumido do projeto
export const generateProjectSummary = (project) => {
  return {
    totalProgress: calculateOverallProgress(project),
    elapsedTime: calculateElapsedTime(project),
    budgetStatus: calculateBudgetStatus(project.spent, project.budget),
    completedTasks: calculateCompletedTasks(project),
    pendingDocuments: calculatePendingDocuments(project),
  };
};

// Funções auxiliares adicionais
const calculateCompletedTasks = (project) => {
  let total = 0;
  let completed = 0;

  project.timeline.forEach((phase) => {
    phase.tasks.forEach((task) => {
      total++;
      if (task.progress === 100) completed++;
    });
  });

  return {
    total,
    completed,
    percentage: total > 0 ? (completed / total) * 100 : 0,
  };
};

const calculatePendingDocuments = (project) => {
  let pending = 0;
  project.documents.forEach((category) => {
    category.items.forEach((doc) => {
      if (doc.status === 'pending') pending++;
    });
  });
  return pending;
};
