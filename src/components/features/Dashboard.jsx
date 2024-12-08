import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Home,
  DollarSign,
  CalendarDays,
  LineChart as LineChartIcon,
  Percent,
  Timer,
  Package,
  Building,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
} from 'lucide-react';

// Cores para os gráficos de pizza
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Função para gerar dados randômicos para projetos
const generateRandomProjectData = () => {
  const progress = Math.floor(Math.random() * 100);
  const planned = progress + Math.floor(Math.random() * 10);
  const budget = Math.floor(Math.random() * 1000000) + 500000;
  const spent = Math.floor(budget * (progress / 100));
  const committed = spent + Math.floor(Math.random() * (budget - spent));
  const monthlyBurn = Math.floor(spent / (Math.floor(Math.random() * 12) + 1));
  const totalWorkers = Math.floor(Math.random() * 100) + 20;
  const attendance = Math.floor(Math.random() * 10) + 90;
  const delay = Math.floor(Math.random() * 20) - 10;
  const criticalTasks = Math.floor(Math.random() * 5);
  const nextMilestone = 'Próximo marco';
  const nextMilestoneDate = '2024-12-31';

  const progressData = [
    {
      month: 'Jan',
      real: Math.floor(Math.random() * 20),
      planned: Math.floor(Math.random() * 25),
    },
    {
      month: 'Fev',
      real: Math.floor(Math.random() * 30),
      planned: Math.floor(Math.random() * 35),
    },
    {
      month: 'Mar',
      real: Math.floor(Math.random() * 50),
      planned: Math.floor(Math.random() * 55),
    },
    {
      month: 'Abr',
      real: Math.floor(Math.random() * 70),
      planned: Math.floor(Math.random() * 75),
    },
    {
      month: 'Mai',
      real: Math.floor(Math.random() * 90),
      planned: Math.floor(Math.random() * 95),
    },
  ];

  const costData = [
    {
      name: 'Material',
      value: Math.floor(budget * 0.4),
      description: 'Insumos e materiais de construção',
    },
    {
      name: 'Mão de obra',
      value: Math.floor(budget * 0.3),
      description: 'Equipe própria e terceirizada',
    },
    {
      name: 'Equipamentos',
      value: Math.floor(budget * 0.2),
      description: 'Locação e manutenção',
    },
    {
      name: 'Serviços',
      value: Math.floor(budget * 0.1),
      description: 'Serviços especializados',
    },
  ];

  return {
    status: {
      progress,
      planned,
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      currentPhase: 'Fase atual',
    },
    financial: {
      budget,
      spent,
      committed,
      monthlyBurn,
    },
    team: {
      totalWorkers,
      contractors: Math.floor(Math.random() * 10),
      attendance,
      safety: {
        incidents: Math.floor(Math.random() * 5),
        lastIncident: `${Math.floor(Math.random() * 100)} dias sem acidentes`,
      },
    },
    schedule: {
      delay,
      criticalTasks,
      nextMilestone,
      nextMilestoneDate,
    },
    progressData,
    costData,
  };
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);

  // Carrega os projetos do localStorage ao montar o componente
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } catch (error) {
        console.error('Erro ao analisar projetos do localStorage:', error);
        setProjects([]);
      }
    } else {
      setProjects([]);
    }
  }, []);

  // Dados específicos para o Edifício Horizonte
  const horizonteData = {
    status: {
      progress: 75,
      planned: 80,
      startDate: '2024-01-15',
      endDate: '2025-06-30',
      currentPhase: 'Estrutura 6º pavimento',
    },
    financial: {
      budget: 1500000,
      spent: 675000,
      committed: 900000,
      monthlyBurn: 150000,
    },
    team: {
      totalWorkers: 48,
      contractors: 5,
      attendance: 95,
      safety: {
        incidents: 0,
        lastIncident: '90 dias sem acidentes',
      },
    },
    schedule: {
      delay: -5,
      criticalTasks: 2,
      nextMilestone: 'Conclusão da estrutura',
      nextMilestoneDate: '2024-04-15',
    },
    progressData: [
      { month: 'Jan', real: 15, planned: 20 },
      { month: 'Fev', real: 35, planned: 40 },
      { month: 'Mar', real: 52, planned: 55 },
      { month: 'Abr', real: 68, planned: 70 },
      { month: 'Mai', real: 75, planned: 80 },
    ],
    costData: [
      {
        name: 'Material',
        value: 350000,
        description: 'Insumos e materiais de construção',
      },
      {
        name: 'Mão de obra',
        value: 200000,
        description: 'Equipe própria e terceirizada',
      },
      {
        name: 'Equipamentos',
        value: 75000,
        description: 'Locação e manutenção',
      },
      {
        name: 'Serviços',
        value: 50000,
        description: 'Serviços especializados',
      },
    ],
  };

  // Dados específicos para o Residencial Parque Verde
  const parqueVerdeData = {
    status: {
      progress: 45,
      planned: 50,
      startDate: '2024-02-01',
      endDate: '2025-08-30',
      currentPhase: 'Fundação',
    },
    financial: {
      budget: 800000,
      spent: 360000,
      committed: 500000,
      monthlyBurn: 80000,
    },
    team: {
      totalWorkers: 32,
      contractors: 3,
      attendance: 97,
      safety: {
        incidents: 1,
        lastIncident: '45 dias sem acidentes',
      },
    },
    schedule: {
      delay: 2,
      criticalTasks: 1,
      nextMilestone: 'Conclusão da fundação',
      nextMilestoneDate: '2024-04-30',
    },
    progressData: [
      { month: 'Jan', real: 0, planned: 0 },
      { month: 'Fev', real: 15, planned: 20 },
      { month: 'Mar', real: 30, planned: 35 },
      { month: 'Abr', real: 45, planned: 50 },
      { month: 'Mai', real: 60, planned: 65 },
    ],
    costData: [
      {
        name: 'Material',
        value: 180000,
        description: 'Insumos e materiais de construção',
      },
      {
        name: 'Mão de obra',
        value: 120000,
        description: 'Equipe própria e terceirizada',
      },
      {
        name: 'Equipamentos',
        value: 40000,
        description: 'Locação e manutenção',
      },
      {
        name: 'Serviços',
        value: 30000,
        description: 'Serviços especializados',
      },
    ],
  };

  // Dashboard geral (original)
  const renderOverview = () => (
    <>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Visão Geral dos Projetos
      </h3>
      {/* Top Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Obras Ativas</CardTitle>
            <Home className="h-6 w-6 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
            <p className="text-xs opacity-75 mt-1">
              {projects.length} em fase inicial
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Gastos Mensais
            </CardTitle>
            <DollarSign className="h-6 w-6 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$200.000</div>
            <p className="text-xs opacity-75 mt-1">Meta: R$180.000</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">
              Visitas Agendadas
            </CardTitle>
            <CalendarDays className="h-6 w-6 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs opacity-75 mt-1">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Produtividade</CardTitle>
            <LineChartIcon className="h-6 w-6 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <p className="text-xs opacity-75 mt-1">Aumento de 5% este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Cards */}
      <h3 className="text-xl font-semibold mb-4 mt-8 text-gray-700">
        Métricas de Desempenho
      </h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Middle Cards */}
        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-800">
              Taxa de Conclusão
            </CardTitle>
            <Percent className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2 text-gray-800">80%</div>
            <Progress value={80} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              Média de todas as obras
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-800">
              Tempo Médio
            </CardTitle>
            <Timer className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">12 meses</div>
            <p className="text-xs text-gray-600 mt-1">Por projeto concluído</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-gray-800">
              Materiais em Falta
            </CardTitle>
            <Package className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">3</div>
            <p className="text-xs text-gray-600 mt-1">Itens para reposição</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <h3 className="text-xl font-semibold mb-4 mt-8 text-gray-700">
        Informações Adicionais
      </h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Pagamentos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-600">
              Existem 5 pagamentos pendentes para fornecedores. Total: R$50.000
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Material em Falta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-600">
              3 obras precisam de reposição de:
            </p>
            <ul className="list-disc list-inside mt-2">
              <li className="text-gray-700">Cimento</li>
              <li className="text-gray-700">Areia</li>
              <li className="text-gray-700">Tijolos</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Segurança no Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base text-gray-600">
              30 dias sem acidentes. Próximo treinamento de segurança em 5 dias.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  // Componente para os Pontos de Atenção
  const AttentionCard = ({
    icon: Icon,
    title,
    description,
    severity = 'warning',
  }) => {
    const severityColors = {
      warning: 'from-amber-500 to-amber-600',
      danger: 'from-red-500 to-red-600',
      info: 'from-blue-500 to-blue-600',
    };

    return (
      <Card
        className={`bg-gradient-to-br ${severityColors[severity]} text-white`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Icon className="h-6 w-6 opacity-75" />
        </CardHeader>
        <CardContent>
          <p className="text-sm">{description}</p>
        </CardContent>
      </Card>
    );
  };

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}:{' '}
              {typeof entry.value === 'number'
                ? entry.name.includes('R$')
                  ? `R$ ${entry.value.toLocaleString()}`
                  : `${entry.value}%`
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
          <p className="font-bold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">{data.description}</p>
          <p className="text-sm font-bold mt-1">
            R$ {data.value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Função para renderizar o dashboard do projeto
  const renderProject = (project) => {
    let projectData;

    // Verifica se é um dos projetos específicos
    if (project.name === 'Edifício Horizonte') {
      projectData = horizonteData;
    } else if (project.name === 'Residencial Parque Verde') {
      projectData = parqueVerdeData;
    } else {
      // Gera dados randômicos para outros projetos
      projectData = generateRandomProjectData();
    }

    const { status, financial, team, schedule, progressData, costData } =
      projectData;

    const renderAttentionCards = () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schedule.criticalTasks > 0 && (
          <AttentionCard
            key="critical-tasks"
            icon={AlertTriangle}
            title="Tarefas Críticas"
            description={`${schedule.criticalTasks} tarefas críticas pendentes`}
            severity="danger"
          />
        )}
        {status.progress < status.planned && (
          <AttentionCard
            key="progress-delay"
            icon={Clock}
            title="Atraso no Progresso"
            description={`Atraso de ${
              status.planned - status.progress
            }% no progresso`}
            severity="warning"
          />
        )}
        {financial.spent > financial.committed && (
          <AttentionCard
            key="cost-alert"
            icon={DollarSign}
            title="Alerta de Custos"
            description="Custos acima do valor comprometido"
            severity="danger"
          />
        )}
      </div>
    );

    return (
      <div key={project.id} className="space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Status da Obra
              </CardTitle>
              <TrendingUp className="h-6 w-6 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{status.progress}%</div>
              <Progress value={status.progress} className="mt-2 bg-blue-400" />
              <p className="text-sm mt-2">Fase: {status.currentPhase}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Orçamento</CardTitle>
              <DollarSign className="h-6 w-6 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {((financial.spent / financial.budget) * 100).toFixed(1)}%
              </div>
              <Progress
                value={(financial.spent / financial.budget) * 100}
                className="mt-2 bg-green-400"
              />
              <p className="text-sm mt-2">
                R$ {financial.spent.toLocaleString()} / R${' '}
                {financial.budget.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Cronograma</CardTitle>
              <Clock className="h-6 w-6 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {schedule.delay < 0 ? '+' : ''}
                {Math.abs(schedule.delay)} dias
              </div>
              <p className="text-sm mt-2">
                {schedule.delay < 0 ? 'Adiantado' : 'Atrasado'}
              </p>
              <p className="text-sm mt-1">
                Próximo marco: {schedule.nextMilestone}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Equipe</CardTitle>
              <Users className="h-6 w-6 opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{team.totalWorkers}</div>
              <p className="text-sm mt-2">Presença: {team.attendance}%</p>
              <p className="text-sm mt-1">{team.safety.lastIncident}</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Avanço Físico */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Avanço Físico vs. Planejado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="real"
                      stroke="#3b82f6"
                      name="Realizado"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="planned"
                      stroke="#93c5fd"
                      name="Planejado"
                      strokeWidth={3}
                      dot={{ r: 6 }}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição de Custos */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Distribuição de Custos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pontos de Atenção */}
        {renderAttentionCards()}
      </div>
    );
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

      {/* Navegação entre as abas */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          <Button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 ${
              activeTab === 'overview'
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
              onClick={() => setActiveTab(project.id)}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 ${
                activeTab === project.id
                  ? 'bg-white text-teal-600 border-b-2 border-teal-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {project.name}
            </Button>
          ))}
        </nav>
      </div>

      {/* Conteúdo da aba selecionada */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab !== 'overview' &&
        projects.map(
          (project) => project.id === activeTab && renderProject(project)
        )}
    </>
  );
}
