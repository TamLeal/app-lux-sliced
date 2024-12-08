import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
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
  AlertTriangle,
  DollarSign,
  FileText,
  TrendingUp,
  AlertCircle,
  Building,
} from 'lucide-react';

export default function FinancialManagement({ data }) {
  const [activeProject, setActiveProject] = useState('overview');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: '',
    type: 'planned',
  });

  // Mock data - em produção, isso viria das props ou de uma API
  const projects = [
    { id: 1, name: 'Edifício Horizonte', budget: 1500000, spent: 1200000 },
    { id: 2, name: 'Residencial Parque Verde', budget: 800000, spent: 400000 },
    { id: 3, name: 'Condomínio Solar', budget: 2000000, spent: 1600000 },
  ];

  const upcomingPayments = [
    {
      id: 1,
      description: 'Fornecedor de Cimento',
      amount: 50000,
      dueDate: '2024-03-25',
    },
    {
      id: 2,
      description: 'Mão de obra - Março',
      amount: 80000,
      dueDate: '2024-03-30',
    },
  ];

  const renderProjectContent = (projectId) => {
    const project = projects.find((p) => p.id === projectId) || projects[0];

    return (
      <div className="space-y-6">
        {/* Resumo do Projeto */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-lg text-gray-600">
                <span>
                  Orçamento Total: R${project.budget.toLocaleString()}
                </span>
                <span>Gasto Total: R${project.spent.toLocaleString()}</span>
              </div>
              <Progress
                value={(project.spent / project.budget) * 100}
                className="h-2"
              />
              <div className="text-right text-sm text-gray-600">
                {((project.spent / project.budget) * 100).toFixed(1)}% utilizado
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registro de Despesas */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Registrar Nova Despesa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  className="border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={newExpense.type}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="planned">Planejada</option>
                  <option value="unplanned">Não Planejada</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  Registrar Despesa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Upload de Notas Fiscais */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-xl text-gray-800">
              Documentos Fiscais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                >
                  Clique para fazer upload ou arraste arquivos aqui
                </Label>
              </div>
              <p className="text-sm text-gray-500">
                Formatos aceitos: PDF, JPG, PNG
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Comparativo Orçado vs Realizado */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <CardTitle className="text-xl text-gray-800">
              Orçado vs Realizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Orçado</TableHead>
                  <TableHead>Realizado</TableHead>
                  <TableHead>Variação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Materiais</TableCell>
                  <TableCell>R$500.000</TableCell>
                  <TableCell>R$480.000</TableCell>
                  <TableCell className="text-green-600">-4%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mão de Obra</TableCell>
                  <TableCell>R$300.000</TableCell>
                  <TableCell>R$320.000</TableCell>
                  <TableCell className="text-red-600">+6.7%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Equipamentos</TableCell>
                  <TableCell>R$200.000</TableCell>
                  <TableCell>R$195.000</TableCell>
                  <TableCell className="text-green-600">-2.5%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alertas de Pagamentos */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <CardTitle className="text-xl text-gray-800">
              Alertas de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>R${payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Próximo
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="grid gap-6 md:grid-cols-3">
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Orçamento: R${project.budget.toLocaleString()}</span>
                <span>Gasto: R${project.spent.toLocaleString()}</span>
              </div>
              <Progress
                value={(project.spent / project.budget) * 100}
                className="h-2"
              />
              <div className="text-right text-sm text-gray-600">
                {((project.spent / project.budget) * 100).toFixed(1)}% utilizado
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Gestão Financeira
      </h2>

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
