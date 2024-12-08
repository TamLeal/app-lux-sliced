import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

// Importação de componentes de formulário
import ProjectForm from '@/components/forms/ProjectForm';
import EditProjectDetailsForm from '@/components/forms/EditProjectDetailsForm';
import EditProjectNameForm from '@/components/forms/EditProjectNameForm';
import EditProjectStatusForm from '@/components/forms/EditProjectStatusForm';
import MilestoneForm from '@/components/forms/MilestoneForm';
import TaskForm from '@/components/forms/TaskForm';

// Importação de componentes de visualização
import ProjectCard from '@/components/cards/ProjectCard';
import Timeline from '@/components/features/Timeline';
import TimelineForm from '@/components/forms/TimelineForm';
import Documents from '@/components/features/Documents';
import Photos from '@/components/features/Photos';
import Overview from '@/components/features/Overview';
import WeatherLog from '@/components/features/WeatherLog';

// Importação de hooks e utilitários
import useWeather from '@/hooks/useWeather';
import useProjectProgress from '@/hooks/useProjectProgress';
import { TABS } from '@/utils/constants';

export default function Projects() {
  // Estados principais
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

  // Estados de modais e formulários
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEditProjectDetails, setShowEditProjectDetails] = useState(false);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editProjectStatus, setEditProjectStatus] = useState(null);

  // Estados para marcos e tarefas
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingPhaseIndex, setEditingPhaseIndex] = useState(null);
  const [newMilestone, setNewMilestone] = useState({
    id: null,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [newTask, setNewTask] = useState({
    id: null,
    name: '',
    status: 'pending',
    progress: 0,
  });

  // Estado para novo projeto e timeline
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
    status: 'planning',
    description: '',
  });

  const [newTimeline, setNewTimeline] = useState({
    phase: '',
    startDate: '',
    endDate: '',
    progress: 0,
    milestones: [],
    tasks: [],
  });

  // Hooks
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

  // Handlers
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
      status: editProjectDetails.status || 'planning',
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
      status: 'planning',
      description: '',
    });
  };

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
              timeline: [...(project.timeline || []), newPhase],
            }
          : project
      )
    );

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
              onEditName={setEditProject}
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
            phases={selectedProject.timeline || []}
            onUpdateProgress={updateProgress}
            onAddPhase={() => setShowTimelineForm(true)}
            onEditPhase={(phaseIndex) => {
              const phase = selectedProject.timeline[phaseIndex];
              setEditProjectDetails(phase);
              setShowTimelineForm(true);
            }}
            onRemovePhase={(phaseIndex) => {
              if (window.confirm('Tem certeza que deseja remover esta fase?')) {
                setProjects((prevProjects) =>
                  prevProjects.map((p) =>
                    p.id === selectedProject.id
                      ? {
                          ...p,
                          timeline: p.timeline.filter((_, idx) => idx !== phaseIndex),
                        }
                      : p
                  )
                );
              }
            }}
            onAddMilestone={(phaseIndex) => {
              setEditingPhaseIndex(phaseIndex);
              setNewMilestone({
                id: null,
                description: '',
                date: new Date().toISOString().split('T')[0],
              });
              setShowMilestoneForm(true);
            }}
            onEditMilestone={(phaseIndex, milestoneId) => {
              const milestone = selectedProject.timeline[phaseIndex].milestones.find(
                (m) => m.id === milestoneId
              );
              setEditingPhaseIndex(phaseIndex);
              setNewMilestone({ ...milestone });
              setShowMilestoneForm(true);
            }}
            onRemoveMilestone={(phaseIndex, milestoneId) => {
              if (window.confirm('Tem certeza que deseja remover este marco?')) {
                setProjects((prevProjects) =>
                  prevProjects.map((p) =>
                    p.id === selectedProject.id
                      ? {
                          ...p,
                          timeline: p.timeline.map((phase, idx) =>
                            idx === phaseIndex
                              ? {
                                  ...phase,
                                  milestones: phase.milestones.filter((m) => m.id !== milestoneId),
                                }
                              : phase
                          ),
                        }
                      : p
                  )
                );
              }
            }}
            onAddTask={(phaseIndex) => {
              setEditingPhaseIndex(phaseIndex);
              setNewTask({
                id: null,
                name: '',
                status: 'pending',
                progress: 0,
              });
              setShowTaskForm(true);
            }}
            onEditTask={(phaseIndex, taskId) => {
              const task = selectedProject.timeline[phaseIndex].tasks.find(
                (t) => t.id === taskId
              );
              setEditingPhaseIndex(phaseIndex);
              setNewTask({ ...task });
              setShowTaskForm(true);
            }}
            onRemoveTask={(phaseIndex, taskId) => {
              if (window.confirm('Tem certeza que deseja remover esta tarefa?')) {
                setProjects((prevProjects) =>
                  prevProjects.map((p) =>
                    p.id === selectedProject.id
                      ? {
                          ...p,
                          timeline: p.timeline.map((phase, idx) =>
                            idx === phaseIndex
                              ? {
                                  ...phase,
                                  tasks: phase.tasks.filter((t) => t.id !== taskId),
                                }
                              : phase
                          ),
                        }
                      : p
                  )
                );
              }
            }}
          />
        );
      case TABS.DOCUMENTS:
        return <Documents documents={selectedProject.documents || []} />;
      case TABS.PHOTOS:
        return <Photos photos={selectedProject.photos || []} />;
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

      {showProjectForm && (
        <ProjectForm
          onSubmit={handleProjectSubmit}
          onCancel={() => setShowProjectForm(false)}
          newProject={editProjectDetails}
          setNewProject={setEditProjectDetails}
        />
      )}

      {showTimelineForm && (
        <TimelineForm
          onSubmit={handleTimelineSubmit}
          onCancel={() => setShowTimelineForm(false)}
          newTimeline={newTimeline}
          setNewTimeline={setNewTimeline}
        />
      )}

      {showEditProjectDetails && (
        <EditProjectDetailsForm
          project={editProjectDetails}
          onSubmit={(e) => {
            e.preventDefault();
            setProjects((prevProjects) =>
              prevProjects.map((p) =>
                p.id === selectedProject.id ? { ...p, ...editProjectDetails } : p
              )
            );
            setShowEditProjectDetails(false);
          }}
          onCancel={() => setShowEditProjectDetails(false)}
        />
      )}

      {editProject && (
        <EditProjectNameForm
          project={editProject}
          onSubmit={(newName) => {
            setProjects((prevProjects) =>
              prevProjects.map((p) =>
                p.id === editProject.id ? { ...p, name: newName } : p
              )
            );
            setEditProject(null);
          }}
          onCancel={() => setEditProject(null)}
        />
      )}

      {editProjectStatus && (
        <EditProjectStatusForm
          project={editProjectStatus}
          onSubmit={(newStatus) => {
            setProjects((prevProjects) =>
              prevProjects.map((p) =>
                p.id === editProjectStatus.id ? { ...p, status: newStatus } : p
              )
            );
            setEditProjectStatus(null);
          }}
          onCancel={() => setEditProjectStatus(null)}
        />
      )}

      {showMilestoneForm && (
        <MilestoneForm
          onSubmit={(e) => {
            e.preventDefault();
            const updatedMilestone = {
              ...newMilestone,
              id: newMilestone.id || Date.now(),
            };

            setProjects((prevProjects) =>
              prevProjects.map((p) =>
                p.id === selectedProject.id
                  ? {
                      ...p,
                      timeline: p.timeline.map((phase, idx) =>
                        idx === editingPhaseIndex
                          ? {
                              ...phase,
                              milestones: newMilestone.id
                                ? phase.milestones.map((m) =>
                                m.id === newMilestone.id ? updatedMilestone : m
                                )
                              : [...(phase.milestones || []), updatedMilestone],
                          }
                        : phase
                    ),
                  }
                : p
            )
          );
          setShowMilestoneForm(false);
        }}
        onCancel={() => setShowMilestoneForm(false)}
        newMilestone={newMilestone}
        setNewMilestone={setNewMilestone}
      />
    )}

    {showTaskForm && (
      <TaskForm
        onSubmit={(e) => {
          e.preventDefault();
          const updatedTask = {
            ...newTask,
            id: newTask.id || Date.now(),
          };

          setProjects((prevProjects) =>
            prevProjects.map((p) =>
              p.id === selectedProject.id
                ? {
                    ...p,
                    timeline: p.timeline.map((phase, idx) =>
                      idx === editingPhaseIndex
                        ? {
                            ...phase,
                            tasks: newTask.id
                              ? phase.tasks.map((t) =>
                                  t.id === newTask.id ? updatedTask : t
                                )
                              : [...(phase.tasks || []), updatedTask],
                          }
                        : phase
                    ),
                  }
                : p
            )
          );
          setShowTaskForm(false);
        }}
        onCancel={() => setShowTaskForm(false)}
        newTask={newTask}
        setNewTask={setNewTask}
      />
    )}
  </div>
);
}