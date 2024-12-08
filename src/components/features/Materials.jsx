import { useState, useEffect } from 'react';
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
  Building,
  Package,
  AlertTriangle,
  Trash2,
  Plus,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit,
} from 'lucide-react';

let nextMaterialId = 1; // Contador global para IDs de materiais

export default function Materials({ data }) {
  const [activeProject, setActiveProject] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    unit: '',
    unitPrice: '',
    supplier: '',
    category: '',
    projectId: '',
  });
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editedMaterial, setEditedMaterial] = useState({});
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetInput, setBudgetInput] = useState('');

  // Dados iniciais de materiais para projetos pré-existentes
  const initialMaterialsData = {
    'Edifício Horizonte': [
      {
        id: nextMaterialId++,
        name: 'Cimento',
        quantity: 100,
        consumedQuantity: 0,
        unit: 'sacos',
        unitPrice: 25,
        supplier: 'Votorantim',
        category: 'Básico',
        minQuantity: 20,
        month: new Date().getMonth() + 1, // Mês atual
      },
      {
        id: nextMaterialId++,
        name: 'Vergalhões',
        quantity: 50,
        consumedQuantity: 0,
        unit: 'barras',
        unitPrice: 45,
        supplier: 'Gerdau',
        category: 'Ferro',
        minQuantity: 10,
        month: new Date().getMonth() + 1, // Mês atual
      },
    ],
    'Residencial Parque Verde': [
      {
        id: nextMaterialId++,
        name: 'Tijolos',
        quantity: 5000,
        consumedQuantity: 0,
        unit: 'unidades',
        unitPrice: 0.5,
        supplier: 'Cerâmica Silva',
        category: 'Alvenaria',
        minQuantity: 1000,
        month: new Date().getMonth() + 1, // Mês atual
      },
      {
        id: nextMaterialId++,
        name: 'Areia',
        quantity: 30,
        consumedQuantity: 0,
        unit: 'm³',
        unitPrice: 120,
        supplier: 'Areial Central',
        category: 'Básico',
        minQuantity: 6,
        month: new Date().getMonth() + 1, // Mês atual
      },
    ],
  };

  useEffect(() => {
    const loadProjects = () => {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects);
          const projectsWithMaterials = parsedProjects.map((project) => {
            if (initialMaterialsData[project.name] && !project.materials) {
              return {
                ...project,
                materials: initialMaterialsData[project.name].map(
                  (material) => ({
                    ...material,
                  })
                ),
              };
            }
            return {
              ...project,
              materials: (project.materials || []).map((material) => ({
                ...material,
                id: material.id || nextMaterialId++,
                quantity: parseFloat(material.quantity),
                consumedQuantity: parseFloat(material.consumedQuantity) || 0,
                unitPrice: parseFloat(material.unitPrice),
                minQuantity: parseFloat(material.minQuantity),
                month: material.month || new Date().getMonth() + 1,
              })),
            };
          });
          setProjects(projectsWithMaterials);

          // Atualiza nextMaterialId
          const allMaterialIds = projectsWithMaterials.flatMap((project) =>
            (project.materials || []).map((material) => material.id)
          );
          nextMaterialId = Math.max(...allMaterialIds, 0) + 1;
        } catch (error) {
          console.error('Erro ao carregar projetos:', error);
          setProjects([]);
        }
      }
    };

    loadProjects();
    window.addEventListener('storage', loadProjects);
    return () => window.removeEventListener('storage', loadProjects);
  }, []);

  const handleAddMaterial = (e, projectId) => {
    e.preventDefault();

    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        const quantity = parseFloat(newMaterial.quantity) || 0;
        const unitPrice = parseFloat(newMaterial.unitPrice) || 0;
        const minQuantity = Math.ceil(quantity * 0.2); // 20% da quantidade inicial

        return {
          ...project,
          materials: [
            ...(project.materials || []),
            {
              ...newMaterial,
              id: nextMaterialId++,
              quantity,
              consumedQuantity: 0,
              unitPrice,
              minQuantity,
              month: new Date().getMonth() + 1, // Mês atual
            },
          ],
        };
      }
      return project;
    });

    updateLocalStorage(updatedProjects);
    setNewMaterial({
      name: '',
      quantity: '',
      unit: '',
      unitPrice: '',
      supplier: '',
      category: '',
      projectId: '',
    });
  };

  const handleDeleteMaterial = (materialId, projectId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          materials: (project.materials || []).filter(
            (material) => material.id !== materialId
          ),
        };
      }
      return project;
    });

    updateLocalStorage(updatedProjects);
  };

  const updateLocalStorage = (updatedProjects) => {
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const categories = [
    'Básico',
    'Ferro',
    'Alvenaria',
    'Hidráulica',
    'Elétrica',
    'Acabamento',
    'Outros',
  ];

  const handleEditMaterial = (material, projectId) => {
    setEditingMaterial(material.id);
    setEditedMaterial({ ...material, projectId });
  };

  const handleSaveEditedMaterial = (e, projectId) => {
    e.preventDefault();
    const updatedMaterial = {
      ...editedMaterial,
      quantity: parseFloat(editedMaterial.quantity) || 0,
      consumedQuantity: parseFloat(editedMaterial.consumedQuantity) || 0,
      unitPrice: parseFloat(editedMaterial.unitPrice) || 0,
      month: new Date().getMonth() + 1, // Atualiza o mês para o mês atual
    };
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          materials: project.materials.map((material) =>
            material.id === editingMaterial ? updatedMaterial : material
          ),
        };
      }
      return project;
    });
    updateLocalStorage(updatedProjects);
    setEditingMaterial(null);
    setEditedMaterial({});
  };

  const renderMaterialsTable = (materials, projectId) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Qtd. Planejada</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Preço Unit.</TableHead>
          <TableHead>Total Planejado</TableHead>
          <TableHead>Qtd. Consumida</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((material) =>
          editingMaterial === material.id ? (
            <TableRow key={material.id}>
              <TableCell>
                <Input
                  value={editedMaterial.name}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      name: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <select
                  value={editedMaterial.category}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      category: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={editedMaterial.quantity}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      quantity: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={editedMaterial.unit}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      unit: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={editedMaterial.unitPrice}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      unitPrice: e.target.value,
                    })
                  }
                />
              </TableCell>
              <TableCell>
                R${' '}
                {(
                  parseFloat(editedMaterial.quantity || 0) *
                  parseFloat(editedMaterial.unitPrice || 0)
                ).toFixed(2)}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={editedMaterial.consumedQuantity}
                  onChange={(e) =>
                    setEditedMaterial({
                      ...editedMaterial,
                      consumedQuantity: e.target.value,
                      month: new Date().getMonth() + 1, // Atualiza o mês para o mês atual
                    })
                  }
                />
              </TableCell>
              <TableCell>
                {editedMaterial.quantity <= editedMaterial.minQuantity ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Baixo Estoque
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Regular
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                  onClick={(e) => handleSaveEditedMaterial(e, projectId)}
                >
                  Salvar
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={material.id}>
              <TableCell className="font-medium">{material.name}</TableCell>
              <TableCell>{material.category}</TableCell>
              <TableCell>{material.quantity}</TableCell>
              <TableCell>{material.unit}</TableCell>
              <TableCell>
                R$ {parseFloat(material.unitPrice).toFixed(2)}
              </TableCell>
              <TableCell>
                R${' '}
                {(
                  parseFloat(material.quantity) * parseFloat(material.unitPrice)
                ).toFixed(2)}
              </TableCell>
              <TableCell>{material.consumedQuantity}</TableCell>
              <TableCell>
                {material.quantity <= material.minQuantity ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Baixo Estoque
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Regular
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-700"
                  onClick={() => handleEditMaterial(material, projectId)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Tem certeza que deseja excluir ${material.name}?`
                      )
                    ) {
                      handleDeleteMaterial(material.id, projectId);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );

  const handleBudgetEdit = (projectId, currentBudget) => {
    setEditingBudget(projectId);
    setBudgetInput(currentBudget?.toString() || '');
  };

  const handleBudgetSave = (projectId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          materialsBudget: parseFloat(budgetInput) || 0,
        };
      }
      return project;
    });

    updateLocalStorage(updatedProjects);
    setEditingBudget(null);
  };

  const renderProjectContent = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    // Calcula o total planejado a partir dos materiais
    const totalPlanejado = (project.materials || []).reduce(
      (sum, material) =>
        sum +
        parseFloat(material.quantity || 0) *
          parseFloat(material.unitPrice || 0),
      0
    );

    // Calcula o total gasto em materiais para este projeto
    const totalGasto = (project.materials || []).reduce(
      (sum, material) =>
        sum +
        parseFloat(material.consumedQuantity || 0) *
          parseFloat(material.unitPrice || 0),
      0
    );

    // Orçamento Estimado definido pelo usuário
    const orcamentoEstimado = project.materialsBudget || 0;

    // Calcula os percentuais
    const percentualUtilizadoPlanejado =
      totalPlanejado > 0 ? (totalGasto / totalPlanejado) * 100 : 0;

    const percentualUtilizadoEstimado =
      orcamentoEstimado > 0 ? (totalGasto / orcamentoEstimado) * 100 : 0;

    return (
      <div className="space-y-6">
        {/* Cards lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card de Orçamento */}
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Orçamento de Materiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Valor Planejado:</p>
                  <div className="text-2xl font-bold text-gray-800">
                    R${' '}
                    {totalPlanejado.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
                {orcamentoEstimado > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Orçamento Estimado:</p>
                    <div className="text-2xl font-bold text-gray-800">
                      R${' '}
                      {orcamentoEstimado.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Valor Gasto:</p>
                  <div className="text-2xl font-bold text-gray-800">
                    R${' '}
                    {totalGasto.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>
                        {orcamentoEstimado > 0
                          ? `${percentualUtilizadoEstimado.toFixed(
                              1
                            )}% do Orçamento Estimado`
                          : `${percentualUtilizadoPlanejado.toFixed(
                              1
                            )}% do Valor Planejado`}
                      </span>
                    </div>
                    <Progress
                      value={
                        orcamentoEstimado > 0
                          ? percentualUtilizadoEstimado
                          : percentualUtilizadoPlanejado
                      }
                      className="h-2"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {editingBudget === project.id ? (
                    <>
                      <Input
                        type="number"
                        value={budgetInput}
                        onChange={(e) => setBudgetInput(e.target.value)}
                        className="w-32"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBudgetSave(project.id);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Salvar
                      </Button>
                    </>
                  ) : (
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBudgetEdit(project.id, project.materialsBudget);
                      }}
                    >
                      <span className="text-sm text-gray-600 mr-2">
                        Orçamento Estimado: R$
                        {orcamentoEstimado.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <Edit className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Novo Material */}
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Adicionar Novo Material
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => handleAddMaterial(e, project.id)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Material</Label>
                    <Input
                      id="name"
                      value={newMaterial.name}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, name: e.target.value })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <select
                      id="category"
                      value={newMaterial.category}
                      onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          category: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newMaterial.quantity}
                      onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          quantity: e.target.value,
                        })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit">Unidade</Label>
                    <Input
                      id="unit"
                      value={newMaterial.unit}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, unit: e.target.value })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      step="0.01"
                      value={newMaterial.unitPrice}
                      onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          unitPrice: e.target.value,
                        })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="supplier">Fornecedor</Label>
                    <Input
                      id="supplier"
                      value={newMaterial.supplier}
                      onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          supplier: e.target.value,
                        })
                      }
                      className="border-gray-300"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Material
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Materiais */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Materiais da Obra
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderMaterialsTable(project.materials || [], project.id)}
          </CardContent>
        </Card>

        {/* Alertas de Estoque */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Alertas de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(project.materials || [])
                .filter((m) => m.quantity <= m.minQuantity)
                .map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <div>
                        <p className="font-medium text-red-800">
                          {material.name}
                        </p>
                        <p className="text-sm text-red-600">
                          Quantidade atual: {material.quantity} {material.unit}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-red-600">
                      Mínimo: {material.minQuantity} {material.unit}
                    </p>
                  </div>
                ))}
              {(project.materials || []).filter(
                (m) => m.quantity <= m.minQuantity
              ).length === 0 && (
                <p className="text-center text-gray-500">
                  Nenhum alerta de estoque no momento.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOverview = () => {
    // Calcula o total gasto em materiais para todos os projetos
    const totalGasto = projects.reduce((total, project) => {
      return (
        total +
        (project.materials || []).reduce(
          (sum, material) =>
            sum +
            parseFloat(material.consumedQuantity || 0) *
              parseFloat(material.unitPrice || 0),
          0
        )
      );
    }, 0);

    // Calcula o total planejado a partir dos materiais de todos os projetos
    const totalPlanejado = projects.reduce((total, project) => {
      return (
        total +
        (project.materials || []).reduce(
          (sum, material) =>
            sum +
            parseFloat(material.quantity || 0) *
              parseFloat(material.unitPrice || 0),
          0
        )
      );
    }, 0);

    return (
      <div className="space-y-6">
        {/* Cards dos Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const materialCount = (project.materials || []).length;
            const alertCount = (project.materials || []).filter(
              (m) => m.quantity <= m.minQuantity
            ).length;
            const projectTotalGasto = (project.materials || []).reduce(
              (sum, material) =>
                sum +
                parseFloat(material.consumedQuantity || 0) *
                  parseFloat(material.unitPrice || 0),
              0
            );
            const projectTotalPlanejado = (project.materials || []).reduce(
              (sum, material) =>
                sum +
                parseFloat(material.quantity || 0) *
                  parseFloat(material.unitPrice || 0),
              0
            );
            const orcamentoEstimado = project.materialsBudget || 0;

            // Calcula os percentuais
            const percentualUtilizadoPlanejado =
              projectTotalPlanejado > 0
                ? (projectTotalGasto / projectTotalPlanejado) * 100
                : 0;

            const percentualUtilizadoEstimado =
              orcamentoEstimado > 0
                ? (projectTotalGasto / orcamentoEstimado) * 100
                : 0;

            return (
              <Card
                key={project.id}
                className="bg-white shadow hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{project.name}</span>
                    <div className="flex items-center space-x-2">
                      {editingBudget === project.id ? (
                        <>
                          <Input
                            type="number"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            className="w-32"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBudgetSave(project.id);
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Salvar
                          </Button>
                        </>
                      ) : (
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBudgetEdit(
                              project.id,
                              project.materialsBudget
                            );
                          }}
                        >
                          <span className="text-sm text-gray-600 mr-2">
                            Orçamento Estimado: R$
                            {orcamentoEstimado.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          <Edit className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent onClick={() => setActiveProject(project.id)}>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Valor Planejado:</p>
                      <div className="text-lg font-bold text-gray-800">
                        R${' '}
                        {projectTotalPlanejado.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor Gasto:</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>
                            R${' '}
                            {projectTotalGasto.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          <span>
                            {orcamentoEstimado > 0
                              ? `${percentualUtilizadoEstimado.toFixed(
                                  1
                                )}% do Orçamento Estimado`
                              : `${percentualUtilizadoPlanejado.toFixed(
                                  1
                                )}% do Valor Planejado`}
                          </span>
                        </div>
                        <Progress
                          value={
                            orcamentoEstimado > 0
                              ? percentualUtilizadoEstimado
                              : percentualUtilizadoPlanejado
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-green-600">
                        <Package className="h-4 w-4 mr-1" />
                        <span>{materialCount} itens</span>
                      </div>
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>{alertCount} alertas</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabela de Todos os Materiais */}
        <Card>
          <CardHeader>
            <CardTitle>Todos os Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Total Planejado</TableHead>
                  <TableHead>Consumido</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.flatMap((project) =>
                  (project.materials || []).map((material) => (
                    <TableRow key={`${project.id}-${material.id}`}>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.category}</TableCell>
                      <TableCell>{material.quantity}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>
                        R$ {parseFloat(material.unitPrice).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        R${' '}
                        {(
                          parseFloat(material.quantity) *
                          parseFloat(material.unitPrice)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>{material.consumedQuantity}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            material.quantity <= material.minQuantity
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {material.quantity <= material.minQuantity
                            ? 'Baixo Estoque'
                            : 'Regular'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Resumo de Gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <ArrowUpCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Gasto</p>
                  <p className="text-2xl font-bold">
                    R${' '}
                    {totalGasto.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <ArrowDownCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Planejado</p>
                  <p className="text-2xl font-bold">
                    R${' '}
                    {totalPlanejado.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (projects.length === 0) {
    return (
      <div className="p-6">
        <Card className="bg-amber-50 border border-amber-200">
          <CardContent className="flex items-center justify-center p-6">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-700">
              Nenhuma obra cadastrada. Adicione uma obra primeiro para gerenciar
              materiais.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Gerenciamento de Materiais
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
