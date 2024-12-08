import { useState, useEffect, useCallback } from 'react';

const useProjectProgress = (initialProject) => {
  const [progress, setProgress] = useState({
    overall: 0,
    phases: [],
    budget: 0,
    timeline: 0,
  });

  // Calcula o progresso de uma fase específica
  const calculatePhaseProgress = useCallback((phase) => {
    if (!phase?.tasks || phase.tasks.length === 0) return 0;

    const totalProgress = phase.tasks.reduce(
      (acc, task) => acc + parseFloat(task?.progress || 0),
      0
    );
    return (totalProgress / phase.tasks.length).toFixed(2);
  }, []);

  // Calcula o progresso geral do projeto
  const calculateOverallProgress = useCallback((project) => {
    if (!project?.timeline || project.timeline.length === 0) return 0;

    const totalProgress = project.timeline.reduce(
      (acc, phase) => acc + parseFloat(phase?.progress || 0),
      0
    );
    return (totalProgress / project.timeline.length).toFixed(2);
  }, []);

  // Calcula o progresso do orçamento
  const calculateBudgetProgress = useCallback((project) => {
    if (!project?.budget || project.budget === 0) return 0;
    return ((project.spent || 0) / project.budget * 100).toFixed(2);
  }, []);

  // Calcula o progresso do cronograma
  const calculateTimelineProgress = useCallback((project) => {
    if (!project?.startDate || !project?.estimatedEndDate) return 0;
    
    const start = new Date(project.startDate);
    const end = new Date(project.estimatedEndDate);
    const now = new Date();

    if (now < start) return 0;
    if (now > end) return 100;

    const totalDuration = end - start;
    const elapsed = now - start;

    return ((elapsed / totalDuration) * 100).toFixed(2);
  }, []);

  // Atualiza todos os progressos
  const updateProgress = useCallback(
    (project) => {
      if (!project) {
        setProgress({
          overall: 0,
          phases: [],
          budget: 0,
          timeline: 0,
        });
        return;
      }

      const phaseProgress = project.timeline?.map((phase) => ({
        id: phase?.id,
        progress: calculatePhaseProgress(phase),
      })) || [];

      setProgress({
        overall: calculateOverallProgress(project),
        phases: phaseProgress,
        budget: calculateBudgetProgress(project),
        timeline: calculateTimelineProgress(project),
      });
    },
    [
      calculatePhaseProgress,
      calculateOverallProgress,
      calculateBudgetProgress,
      calculateTimelineProgress,
    ]
  );

  // Atualiza o progresso quando o projeto muda
  useEffect(() => {
    updateProgress(initialProject);
  }, [initialProject, updateProgress]);

  return {
    progress,
    updateProgress,
    calculatePhaseProgress,
    calculateOverallProgress,
  };
};

export default useProjectProgress;