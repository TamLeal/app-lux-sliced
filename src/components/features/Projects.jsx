/**
 * @fileoverview Projects
 *
 * @description
 * Componente principal que gerencia toda a aplicação de gerenciamento de projetos.
 * Atua como orquestrador, controlando o estado global e a navegação entre diferentes
 * visualizações do projeto.
 *
 * @dependencies
 * Diversos componentes e hooks customizados
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Home } from 'lucide-react';

// Importação de componentes de formulário
import ProjectForm from '@/components/forms/ProjectForm';
import EditProjectDetailsForm from '@/components/forms/EditProjectDetailsForm';
import EditProjectNameForm from '@/components/forms/EditProjectNameForm';
import EditProjectStatusForm from '@/components/forms/EditProjectStatusForm';

// Importação de componentes de visualização
import ProjectCard from '@/components/cards/ProjectCard';
import MetricsCard from '@/components/cards/MetricsCard';
import Timeline from '@/components/features/Timeline';
import TimelineForm from '@/components/forms/TimelineForm';  // Ajuste o caminho conforme necessário
import Documents from '@/components/features/Documents';
import Photos from '@/components/features/Photos';
import Overview from '@/components/features/Overview';
import WeatherLog from '@/components/features/WeatherLog';

// Importação de hooks e utilitários
import useWeather from '@/hooks/useWeather';
import useProjectProgress from '@/hooks/useProjectProgress';
import { TABS } from '@/utils/constants';
import { calculateElapsedTime } from '@/utils/projectUtils';

export default function Projects() {
  // Estados principais
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEditProjectDetails, setShowEditProjectDetails] = useState(false);
  const [showTimelineForm, setShowTimelineForm] = useState(false); // Para controlar a visibilidade do formulário de nova fase
  const [newTimeline, setNewTimeline] = useState({
    phase: '',
    startDate: '',
    endDate: '',
    progress: 0,
    milestones: [],
    tasks: [],
  });

  // Estados de edição
  const [editProject, setEditProject] = useState(null);
  const [editProjectStatus, setEditProjectStatus] = useState(null);
  const [editProjectDetails, setEditProjectDetails] = useState({
    name: '',
    constructionType: '',
    address: '',
    responsibleEngineer: '',
    startDate: '',
    estimatedEndDate: '',
    totalArea: '',
    numberOfUnits: '',
    budget: '',
    status: '',
    description: '',
  });

  // Hooks customizados
  const { weatherData, forecastData, loading: weatherLoading, error: weatherError } = useWeather();
  const { progress, updateProgress } = useProjectProgress(selectedProject);

  // Efeitos
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (selectedProject) {
      const updatedProject = projects.find((p) => p.id === selectedProject.id);
      setSelectedProject(updatedProject);
    }
  }, [projects]);

  // Função para adicionar nova fase
  const handleTimelineSubmit = (e) => {
    e.preventDefault();

    const newPhase = {
      phase: newTimeline.phase,
      startDate: newTimeline.startDate,
      endDate: newTimeline.endDate,
      progress: 0,
      milestones: [],
      tasks: [],
    };

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              timeline: [...project.timeline, newPhase], // Adicionando a nova fase à timeline
            }
          : project
      )
    );

    setSelectedProject((prev) => ({
      ...prev,
      timeline: [...prev.timeline, newPhase],
    }));

    setShowTimelineForm(false);
    setNewTimeline({
      phase: '',
      startDate: '',
      endDate: '',
      progress: 0,
      milestones: [],
      tasks: [],
    });
  };

  // Função para exibir o formulário de adicionar nova fase
  const showAddPhaseForm = () => {
    setShowTimelineForm(true);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setActiveTab(TABS.OVERVIEW);
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const projectToAdd = {
      id: Date.now(),
      ...editProjectDetails,
      progress: 0,
      spent: 0,
      photos: [],
      timeline: [],
      documents: [],
    };

    setProjects((prev) => [...prev, projectToAdd]);
    setShowProjectForm(false);
    setEditProjectDetails({
      name: '',
      constructionType: '',
      address: '',
      responsibleEngineer: '',
      startDate: '',
      estimatedEndDate: '',
      totalArea: '',
      numberOfUnits: '',
      budget: '',
      status: '',
      description: '',
    });
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Tem certeza que deseja remover esta obra?')) {
      setProjects((prevProjects) =>
        prevProjects.filter((p) => p.id !== projectId)
      );
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
      }
    }
  };

  const renderContent = () => {
    if (!selectedProject) {
      return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={handleProjectSelect}
              onEdit={setEditProject}
              onEditStatus={setEditProjectStatus}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case TABS.OVERVIEW:
        return (
          <Overview
            project={selectedProject}
            weatherData={weatherData}
            forecastData={forecastData}
            weatherLoading={weatherLoading}
            weatherError={weatherError}
            onEditDetails={() => {
              setEditProjectDetails(selectedProject);
              setShowEditProjectDetails(true);
            }}
          />
        );
      case TABS.TIMELINE:
        return (
          <Timeline
            phases={selectedProject.timeline}
            onUpdateProgress={updateProgress}
            onAddPhase={showAddPhaseForm} // Passando a função para mostrar o formulário de nova fase
          />
        );
      case TABS.DOCUMENTS:
        return <Documents documents={selectedProject.documents} />;
      case TABS.PHOTOS:
        return <Photos photos={selectedProject.photos} />;
      case TABS.WEATHER:
        return (
          <WeatherLog
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            projects={projects}
            setProjects={setProjects}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Gerenciamento de Obras
        </h2>
        <Button
          onClick={() => setShowProjectForm(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Obra
        </Button>
      </div>

      {selectedProject && (
        <>
          <div className="flex items-center space-x-4 mb-6">
            <Button
              onClick={() => setSelectedProject(null)}
              variant="ghost"
              className="text-gray-600"
            >
              ← Voltar
            </Button>
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedProject.name}
            </h3>
          </div>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-4">
              {Object.entries(TABS).map(([key, value]) => (
                <Button
                  key={key}
                  onClick={() => setActiveTab(value)}
                  className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 ${
                    activeTab === value
                      ? 'bg-white text-teal-600 border-b-2 border-teal-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </Button>
              ))}
            </nav>
          </div>
        </>
      )}

      {renderContent()}

      {showTimelineForm && (
        <TimelineForm
          onSubmit={handleTimelineSubmit}
          onCancel={() => setShowTimelineForm(false)}
          newTimeline={newTimeline}
          setNewTimeline={setNewTimeline}
        />
      )}

      {/* Restante dos formulários */}
    </div>
  );
}
