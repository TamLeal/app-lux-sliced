import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  Building,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  Users,
  Package,
  FileText,
  BarChart,
} from 'lucide-react';

export default function Reports({ data }) {
  const [activeProject, setActiveProject] = useState('overview');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Função para calcular métricas para cada projeto
  const calculateMetrics = (project) => {
    // Taxa de conclusão baseada no progresso geral do projeto
    const completionRate = parseFloat(project.progress) || 0;

    // Orçamento e gastos
    const budget = parseFloat(project.budget) || 0;
    const spent = parseFloat(project.spent) || 0;

    // Atualiza o gasto com base nos materiais consumidos
    const materialsSpent = (project.materials || []).reduce(
      (sum, material) =>
        sum +
        parseFloat(material.consumedQuantity || 0) *
          parseFloat(material.unitPrice || 0),
      0
    );

    const totalSpent = spent + materialsSpent;

    // Tarefas atrasadas
    const delayedTasks = (project.timeline || []).reduce((count, phase) => {
      const today = new Date();
      const endDate = new Date(phase.endDate);
      const phaseProgress = parseFloat(phase.progress) || 0;

      if (today > endDate && phaseProgress < 100) {
        return count + 1;
      }
      return count;
    }, 0);

    // Trabalhadores ativos (soma das tarefas em progresso)
    const activeWorkers = (project.timeline || []).reduce((count, phase) => {
      return (
        count +
        (phase.tasks || []).filter((task) => task.status === 'in_progress')
          .length
      );
    }, 0);

    // Materiais em estoque (número de materiais com quantidade > 0)
    const materialsInStock = (project.materials || []).filter(
      (material) => material.quantity > 0
    ).length;

    // Próxima entrega (próximo marco)
    const nextMilestoneDate = (project.timeline || [])
      .flatMap((phase) => phase.milestones || [])
      .map((milestone) => new Date(milestone.date))
      .filter((date) => date > new Date())
      .sort((a, b) => a - b)[0];

    return {
      completionRate,
      budget,
      spent: totalSpent,
      delayedTasks,
      activeWorkers,
      materialsInStock,
      nextDelivery: nextMilestoneDate
        ? nextMilestoneDate.toLocaleDateString()
        : 'N/A',
    };
  };

  // Função para gerar uso de materiais com base nos dados reais
  const generateMaterialUsage = (project) => {
    return (project.materials || []).map((material) => {
      return {
        material: material.name,
        planned: parseFloat(material.quantity) || 0,
        used: parseFloat(material.consumedQuantity) || 0,
        unit: material.unit || '',
      };
    });
  };

  // Função para gerar relatórios financeiros por mês
  const generateFinancialReports = (project) => {
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const monthlyData = {};

    (project.materials || []).forEach((material) => {
      const monthIndex = (material.month || 1) - 1; // Ajusta para índice do array
      const monthName = months[monthIndex];

      if (!monthlyData[monthName]) {
        monthlyData[monthName] = { planned: 0, actual: 0 };
      }

      // Planejado: quantidade planejada * preço unitário
      monthlyData[monthName].planned +=
        parseFloat(material.quantity || 0) *
        parseFloat(material.unitPrice || 0);

      // Realizado: quantidade consumida * preço unitário
      monthlyData[monthName].actual +=
        parseFloat(material.consumedQuantity || 0) *
        parseFloat(material.unitPrice || 0);
    });

    // Converte o objeto em um array para uso na tabela
    const financialReports = Object.keys(monthlyData).map((month) => ({
      month,
      planned: monthlyData[month].planned,
      actual: monthlyData[month].actual,
    }));

    return financialReports;
  };

  // Função para gerar atrasos de tarefas
  const generateTaskDelays = (project) => {
    return (project.timeline || []).flatMap((phase) => {
      const today = new Date();
      const endDate = new Date(phase.endDate);
      const phaseProgress = parseFloat(phase.progress) || 0;

      if (today > endDate && phaseProgress < 100) {
        const delayDays = Math.ceil((today - endDate) / (1000 * 60 * 60 * 24));
        return [
          {
            task: phase.phase,
            delay: delayDays,
            impact: delayDays > 5 ? 'Alto' : delayDays > 2 ? 'Médio' : 'Baixo',
          },
        ];
      }
      return [];
    });
  };

  // Função para gerar métricas da força de trabalho
  const generateWorkforceMetrics = (project) => {
    // Exemplo simples: contar o número de trabalhadores planejados vs atuais
    // Você pode ajustar conforme necessário
    const plannedWorkers = (project.workforce || []).reduce(
      (sum, role) => sum + parseInt(role.planned || 0),
      0
    );

    const actualWorkers = (project.workforce || []).reduce(
      (sum, role) => sum + parseInt(role.actual || 0),
      0
    );

    return (project.workforce || []).map((role) => ({
      role: role.role,
      planned: role.planned,
      actual: role.actual,
    }));
  };

  const renderProjectContent = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const metrics = calculateMetrics(project);
    const materialUsage = generateMaterialUsage(project);
    const financialReports = generateFinancialReports(project);
    const taskDelays = generateTaskDelays(project);
    const workforceMetrics = generateWorkforceMetrics(project);

    return (
      <div className="space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ... [código das métricas principais permanece o mesmo] */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold">
                    {metrics.completionRate}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={metrics.completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orçamento Utilizado</p>
                  <p className="text-2xl font-bold">
                    {((metrics.spent / metrics.budget) * 100).toFixed(1)}%
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <Progress
                value={(metrics.spent / metrics.budget) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tarefas Atrasadas</p>
                  <p className="text-2xl font-bold">{metrics.delayedTasks}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trabalhadores Ativos</p>
                  <p className="text-2xl font-bold">{metrics.activeWorkers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relatório Financeiro */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-gray-800">
              Relatório Financeiro
            </CardTitle>
            <DollarSign className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mês</TableHead>
                  <TableHead>Planejado</TableHead>
                  <TableHead>Realizado</TableHead>
                  <TableHead>Variação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialReports.map((report, index) => {
                  const variation =
                    report.planned > 0
                      ? ((report.actual - report.planned) / report.planned) *
                        100
                      : 0;
                  return (
                    <TableRow key={index}>
                      <TableCell>{report.month}</TableCell>
                      <TableCell>R$ {report.planned.toFixed(2)}</TableCell>
                      <TableCell>R$ {report.actual.toFixed(2)}</TableCell>
                      <TableCell
                        className={
                          variation > 0 ? 'text-red-600' : 'text-green-600'
                        }
                      >
                        {variation > 0 ? '+' : ''}
                        {variation.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Atrasos de Tarefas */}
        {/* ... [código permanece o mesmo] */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-gray-800">
              Atrasos em Tarefas
            </CardTitle>
            <Clock className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            {taskDelays.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Dias de Atraso</TableHead>
                    <TableHead>Impacto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskDelays.map((delay, index) => (
                    <TableRow key={index}>
                      <TableCell>{delay.task}</TableCell>
                      <TableCell>{delay.delay} dias</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            delay.impact === 'Alto'
                              ? 'bg-red-100 text-red-800'
                              : delay.impact === 'Médio'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {delay.impact}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">
                Nenhum atraso registrado.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Uso de Materiais */}
        {/* ... [código permanece o mesmo] */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-gray-800">
              Consumo de Materiais
            </CardTitle>
            <Package className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Planejado</TableHead>
                  <TableHead>Utilizado</TableHead>
                  <TableHead>Eficiência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialUsage.map((material, index) => {
                  const efficiency =
                    material.planned > 0
                      ? ((material.used / material.planned) * 100).toFixed(1)
                      : '0';
                  return (
                    <TableRow key={index}>
                      <TableCell>{material.material}</TableCell>
                      <TableCell>
                        {material.planned} {material.unit}
                      </TableCell>
                      <TableCell>
                        {material.used} {material.unit}
                      </TableCell>
                      <TableCell
                        className={
                          Number(efficiency) > 100
                            ? 'text-red-600'
                            : 'text-green-600'
                        }
                      >
                        {efficiency}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Métricas da Força de Trabalho */}
        {/* ... [código permanece o mesmo, ajuste conforme necessário] */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-gray-800">
              Força de Trabalho
            </CardTitle>
            <Users className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            {workforceMetrics.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Função</TableHead>
                    <TableHead>Planejado</TableHead>
                    <TableHead>Atual</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workforceMetrics.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell>{metric.role}</TableCell>
                      <TableCell>{metric.planned}</TableCell>
                      <TableCell>{metric.actual}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            metric.actual < metric.planned
                              ? 'bg-red-100 text-red-800'
                              : metric.actual === metric.planned
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {metric.actual < metric.planned
                            ? 'Abaixo'
                            : metric.actual === metric.planned
                            ? 'Adequado'
                            : 'Acima'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">
                Nenhuma informação disponível.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOverview = () => {
    // Ajuste as métricas consolidadas para refletir os dados reais
    const totalInvestment = projects.reduce(
      (sum, p) => sum + (parseFloat(p.budget) || 0),
      0
    );
    const totalExecuted = projects.reduce((sum, p) => {
      const materialsSpent = (p.materials || []).reduce(
        (sumMat, material) =>
          sumMat +
          parseFloat(material.consumedQuantity || 0) *
            parseFloat(material.unitPrice || 0),
        0
      );
      return sum + (parseFloat(p.spent) || 0) + materialsSpent;
    }, 0);
    const totalWorkforce = projects.reduce((sum, p) => {
      const metrics = calculateMetrics(p);
      return sum + metrics.activeWorkers;
    }, 0);

    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => {
            const metrics = calculateMetrics(project);
            return (
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
                      <div>
                        <p className="text-sm text-gray-500">Conclusão</p>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                          <p className="text-lg font-semibold">
                            {metrics.completionRate}%
                          </p>
                        </div>
                        <Progress
                          value={metrics.completionRate}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Orçamento Utilizado
                        </p>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                          <p className="text-lg font-semibold">
                            R$ {metrics.spent.toLocaleString()}
                          </p>
                        </div>
                        <Progress
                          value={(metrics.spent / metrics.budget) * 100}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Tarefas Atrasadas
                        </p>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                          <p className="text-lg font-semibold">
                            {metrics.delayedTasks}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Equipe Ativa</p>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-purple-500 mr-2" />
                          <p className="text-lg font-semibold">
                            {metrics.activeWorkers}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={() => setActiveProject(project.id)}
                      >
                        Ver Relatório Completo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Métricas Consolidadas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Investimento Total</p>
                  <p className="text-2xl font-bold">
                    R$ {totalInvestment.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Executado</p>
                  <p className="text-2xl font-bold">
                    R$ {totalExecuted.toLocaleString()}
                  </p>
                </div>
                <BarChart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Força de Trabalho Total
                  </p>
                  <p className="text-2xl font-bold">{totalWorkforce}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de Alertas */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Alertas Consolidados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => {
                const taskDelays = generateTaskDelays(project);
                return (
                  taskDelays.length > 0 && (
                    <div
                      key={project.id}
                      className="p-4 bg-amber-50 rounded-lg"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {project.name}
                      </h3>
                      <div className="space-y-2">
                        {taskDelays.map((delay, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            <span>
                              {delay.task} - {delay.delay} dias de atraso
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Relatórios</h2>

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
