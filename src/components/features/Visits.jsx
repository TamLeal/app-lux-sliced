import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Building,
  Calendar,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Receipt,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Função para formatar datas
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Função para formatar valores monetários
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

// Tipos de despesas disponíveis
const expenseTypes = [
  { value: 'material', label: 'Material' },
  { value: 'mão_de_obra', label: 'Mão de Obra' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'outros', label: 'Outros' },
];

export default function Visits() {
  const [activeProject, setActiveProject] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [newVisit, setNewVisit] = useState({
    date: '',
    time: '',
    purpose: '',
    participants: '',
    location: '',
    observations: '',
  });
  const [newExpense, setNewExpense] = useState({});
  const [expandedVisits, setExpandedVisits] = useState({});

  // Dados mockados para os empreendimentos iniciais
  const initialVisits = {
    'Edifício Horizonte': [
      {
        id: 1,
        date: '2024-03-25',
        time: '14:00',
        purpose: 'Vistoria Estrutural',
        participants: 'João Silva, Maria Santos',
        location: 'Pavimento 3',
        observations: 'Verificação das instalações elétricas',
        expenses: [],
      },
      {
        id: 2,
        date: '2024-03-28',
        time: '09:00',
        purpose: 'Medição Mensal',
        participants: 'Carlos Oliveira',
        location: 'Obra completa',
        observations: 'Medição para faturamento',
        expenses: [],
      },
    ],
    'Residencial Parque Verde': [
      {
        id: 3,
        date: '2024-03-26',
        time: '10:00',
        purpose: 'Inspeção de Qualidade',
        participants: 'Ana Paula, Roberto Carlos',
        location: 'Área comum',
        observations: 'Verificação dos acabamentos',
        expenses: [],
      },
    ],
  };

  useEffect(() => {
    const loadProjects = () => {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects);
          setProjects(
            parsedProjects.map((project) => {
              // Se for um dos projetos iniciais e não tiver visitas ainda, usa os dados mockados
              if (initialVisits[project.name] && !project.visits) {
                return {
                  ...project,
                  visits: initialVisits[project.name],
                };
              }
              // Para novos projetos ou projetos que já têm visitas, mantém como está
              return {
                ...project,
                visits: project.visits || [],
              };
            })
          );
        } catch (error) {
          console.error('Erro ao carregar projetos:', error);
          setProjects([]);
        }
      }
    };

    loadProjects();

    // Adiciona listener para mudanças no localStorage
    const handleStorageChange = () => {
      loadProjects();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Função para atualizar o localStorage
  const updateLocalStorage = (updatedProjects) => {
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  // Função para adicionar uma nova visita
  const handleAddVisit = (e) => {
    e.preventDefault();

    const newVisitObj = {
      id: Date.now(),
      ...newVisit,
      expenses: [],
    };

    const updatedProjects = projects.map((project) => {
      if (project.id === activeProject) {
        return {
          ...project,
          visits: [...(project.visits || []), newVisitObj],
        };
      }
      return project;
    });

    updateLocalStorage(updatedProjects);

    setNewVisit({
      date: '',
      time: '',
      purpose: '',
      participants: '',
      location: '',
      observations: '',
    });
  };

  // Função para deletar uma visita
  const handleDeleteVisit = (projectId, visitId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          visits: (project.visits || []).filter(
            (visit) => visit.id !== visitId
          ),
        };
      }
      return project;
    });

    updateLocalStorage(updatedProjects);
  };

  // Função para adicionar uma nova despesa
  const handleAddExpense = (e, visitId, projectId) => {
    e.preventDefault();

    const expenseData = newExpense[visitId];
    if (!expenseData) return;

    const newExpenseObj = {
      id: Date.now(),
      type: expenseData.type,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date,
      description: expenseData.description,
      receipt: expenseData.receipt || false,
    };

    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          visits: project.visits.map((visit) => {
            if (visit.id === visitId) {
              return {
                ...visit,
                expenses: [...(visit.expenses || []), newExpenseObj],
              };
            }
            return visit;
          }),
        };
      }
      return project;
    });

    updateLocalStorage(updatedProjects);

    setNewExpense((prev) => ({
      ...prev,
      [visitId]: {
        type: '',
        amount: '',
        date: '',
        description: '',
        receipt: false,
      },
    }));
  };

  // Função para deletar uma despesa
  const handleDeleteExpense = (projectId, visitId, expenseId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          visits: project.visits.map((visit) => {
            if (visit.id === visitId) {
              return {
                ...visit,
                expenses: (visit.expenses || []).filter(
                  (expense) => expense.id !== expenseId
                ),
              };
            }
            return visit;
          }),
        };
      }
      return project;
    });

    updateLocalStorage(updatedProjects);
  };

  // Função para alternar a expansão de uma visita
  const toggleVisitExpansion = (visitId) => {
    setExpandedVisits((prev) => ({
      ...prev,
      [visitId]: !prev[visitId],
    }));
  };

  // Função para renderizar o conteúdo de um projeto específico
  const renderProjectContent = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    // Ordena as visitas por data
    const sortedVisits = [...(project.visits || [])].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna da Esquerda: Formulário */}
        <div>
          {/* Formulário de Visita */}
          <Card className="bg-white shadow-lg rounded-lg transition-all duration-300 h-full">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Agendar Nova Visita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddVisit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="date">Data da Visita</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newVisit.date}
                      onChange={(e) =>
                        setNewVisit({ ...newVisit, date: e.target.value })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newVisit.time}
                      onChange={(e) =>
                        setNewVisit({ ...newVisit, time: e.target.value })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose">Finalidade</Label>
                    <Input
                      id="purpose"
                      value={newVisit.purpose}
                      onChange={(e) =>
                        setNewVisit({ ...newVisit, purpose: e.target.value })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="participants">Participantes</Label>
                    <Input
                      id="participants"
                      value={newVisit.participants}
                      onChange={(e) =>
                        setNewVisit({
                          ...newVisit,
                          participants: e.target.value,
                        })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Local Específico</Label>
                    <Input
                      id="location"
                      value={newVisit.location}
                      onChange={(e) =>
                        setNewVisit({ ...newVisit, location: e.target.value })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="observations">Observações</Label>
                    <textarea
                      id="observations"
                      value={newVisit.observations}
                      onChange={(e) =>
                        setNewVisit({
                          ...newVisit,
                          observations: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1 h-20"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agendar Visita
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Visitas */}
        <div>
          {/* Lista de Visitas */}
          <Card className="bg-white shadow-lg rounded-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Visitas Agendadas - {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedVisits && sortedVisits.length > 0 ? (
                <div className="space-y-4">
                  {sortedVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div
                        className="bg-gray-100 px-4 py-3 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleVisitExpansion(visit.id)}
                      >
                        <div>
                          <p className="font-semibold">
                            {formatDate(visit.date)} - {visit.time} |{' '}
                            {visit.purpose}
                          </p>
                          <p className="text-sm text-gray-600">
                            {visit.participants}
                          </p>
                        </div>
                        <div>
                          {expandedVisits[visit.id] ? (
                            <ChevronUp className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                      {expandedVisits[visit.id] && (
                        <div className="p-4 space-y-4">
                          {/* Informações da Visita */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Local</p>
                              <p className="font-medium">{visit.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Observações
                              </p>
                              <p className="font-medium">
                                {visit.observations}
                              </p>
                            </div>
                          </div>

                          {/* Ações da Visita */}
                          <div className="flex justify-end">
                            <Button
                              onClick={() =>
                                handleDeleteVisit(project.id, visit.id)
                              }
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir Visita
                            </Button>
                          </div>

                          {/* Seção de Despesas */}
                          <div className="border-t pt-4">
                            <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                              <Receipt className="h-5 w-5 mr-2" />
                              Despesas
                            </h4>

                            {/* Lista de Despesas */}
                            {visit.expenses && visit.expenses.length > 0 ? (
                              <div className="space-y-2">
                                {visit.expenses.map((expense) => (
                                  <div
                                    key={expense.id}
                                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {expenseTypes.find(
                                          (type) => type.value === expense.type
                                        )?.label || expense.type}{' '}
                                        - {formatCurrency(expense.amount)}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {formatDate(expense.date)} |{' '}
                                        {expense.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span
                                        className={
                                          expense.receipt
                                            ? 'text-green-600 text-sm'
                                            : 'text-red-600 text-sm'
                                        }
                                      >
                                        {expense.receipt ? 'Comprovante' : ''}
                                      </span>
                                      <Button
                                        onClick={() =>
                                          handleDeleteExpense(
                                            project.id,
                                            visit.id,
                                            expense.id
                                          )
                                        }
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-end items-center space-x-2 text-lg font-semibold mt-2">
                                  <DollarSign className="h-5 w-5 text-gray-600" />
                                  <span>
                                    Total:{' '}
                                    {formatCurrency(
                                      visit.expenses.reduce(
                                        (sum, expense) =>
                                          sum + Number(expense.amount),
                                        0
                                      )
                                    )}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500">
                                Nenhuma despesa registrada para esta visita.
                              </p>
                            )}

                            {/* Formulário de Nova Despesa */}
                            <div className="mt-4">
                              <h5 className="text-md font-medium text-gray-700 mb-2">
                                Registrar Nova Despesa
                              </h5>
                              <form
                                onSubmit={(e) =>
                                  handleAddExpense(e, visit.id, project.id)
                                }
                                className="space-y-2"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`expense-type-${visit.id}`}>
                                      Tipo de Despesa
                                    </Label>
                                    <select
                                      id={`expense-type-${visit.id}`}
                                      value={
                                        (newExpense[visit.id] &&
                                          newExpense[visit.id].type) ||
                                        ''
                                      }
                                      onChange={(e) =>
                                        setNewExpense((prev) => ({
                                          ...prev,
                                          [visit.id]: {
                                            ...prev[visit.id],
                                            type: e.target.value,
                                          },
                                        }))
                                      }
                                      className="w-full border border-gray-300 rounded px-2 py-1"
                                      required
                                    >
                                      <option value="">Selecione o tipo</option>
                                      {expenseTypes.map((type) => (
                                        <option
                                          key={type.value}
                                          value={type.value}
                                        >
                                          {type.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div>
                                    <Label
                                      htmlFor={`expense-amount-${visit.id}`}
                                    >
                                      Valor (R$)
                                    </Label>
                                    <Input
                                      id={`expense-amount-${visit.id}`}
                                      type="number"
                                      step="0.01"
                                      value={
                                        (newExpense[visit.id] &&
                                          newExpense[visit.id].amount) ||
                                        ''
                                      }
                                      onChange={(e) =>
                                        setNewExpense((prev) => ({
                                          ...prev,
                                          [visit.id]: {
                                            ...prev[visit.id],
                                            amount: e.target.value,
                                          },
                                        }))
                                      }
                                      className="border-gray-300"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor={`expense-date-${visit.id}`}>
                                      Data
                                    </Label>
                                    <Input
                                      id={`expense-date-${visit.id}`}
                                      type="date"
                                      value={
                                        (newExpense[visit.id] &&
                                          newExpense[visit.id].date) ||
                                        ''
                                      }
                                      onChange={(e) =>
                                        setNewExpense((prev) => ({
                                          ...prev,
                                          [visit.id]: {
                                            ...prev[visit.id],
                                            date: e.target.value,
                                          },
                                        }))
                                      }
                                      className="border-gray-300"
                                      required
                                    />
                                  </div>

                                  <div className="sm:col-span-2">
                                    <Label
                                      htmlFor={`expense-description-${visit.id}`}
                                    >
                                      Descrição
                                    </Label>
                                    <Input
                                      id={`expense-description-${visit.id}`}
                                      value={
                                        (newExpense[visit.id] &&
                                          newExpense[visit.id].description) ||
                                        ''
                                      }
                                      onChange={(e) =>
                                        setNewExpense((prev) => ({
                                          ...prev,
                                          [visit.id]: {
                                            ...prev[visit.id],
                                            description: e.target.value,
                                          },
                                        }))
                                      }
                                      className="border-gray-300"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`expense-receipt-${visit.id}`}
                                    checked={
                                      (newExpense[visit.id] &&
                                        newExpense[visit.id].receipt) ||
                                      false
                                    }
                                    onChange={(e) =>
                                      setNewExpense((prev) => ({
                                        ...prev,
                                        [visit.id]: {
                                          ...prev[visit.id],
                                          receipt: e.target.checked,
                                        },
                                      }))
                                    }
                                    className="rounded border-gray-300"
                                  />
                                  <Label
                                    htmlFor={`expense-receipt-${visit.id}`}
                                    className="select-none"
                                  >
                                    Possui comprovante
                                  </Label>
                                </div>

                                <Button
                                  type="submit"
                                  className="bg-teal-500 hover:bg-teal-600 text-white mt-2"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Adicionar Despesa
                                </Button>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma visita agendada para este projeto.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Função para renderizar a visão geral
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setActiveProject(project.id)}
          >
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{(project.visits || []).length} visitas agendadas</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    Próxima:{' '}
                    {project.visits && project.visits[0]?.date
                      ? formatDate(project.visits[0].date)
                      : 'Nenhuma'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Verifica se não há projetos
  if (projects.length === 0) {
    return (
      <div className="p-6">
        <Card className="bg-amber-50 border border-amber-200">
          <CardContent className="flex items-center justify-center p-6">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-700">
              Nenhuma obra cadastrada. Adicione uma obra primeiro para gerenciar
              visitas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Visitas Agendadas
      </h2>

      {/* Navegação por Abas */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto max-w-full">
        <nav className="flex space-x-4 flex-nowrap">
          <Button
            onClick={() => setActiveProject('overview')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 flex-shrink-0 ${
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
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 flex-shrink-0 ${
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
    </div>
  );
}
