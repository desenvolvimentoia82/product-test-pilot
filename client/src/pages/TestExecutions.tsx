import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ProductSelector } from '@/components/products/ProductSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Play, Clock, User, CheckCircle, XCircle, AlertTriangle, Minus } from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';
import { useTestExecutions } from '@/hooks/useTestExecutions';
import { useTestPlans } from '@/hooks/useTestPlans';
import { useTestCases } from '@/hooks/useTestCases';
import { TestExecutionDialog } from '@/components/test-executions/TestExecutionDialog';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'passed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'blocked':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'skipped':
      return <Minus className="h-4 w-4 text-gray-600" />;
    default:
      return <Clock className="h-4 w-4 text-blue-600" />;
  }
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: 'Pendente', className: 'bg-blue-100 text-blue-800' },
    passed: { label: 'Passou', className: 'bg-green-100 text-green-800' },
    failed: { label: 'Falhou', className: 'bg-red-100 text-red-800' },
    blocked: { label: 'Bloqueado', className: 'bg-yellow-100 text-yellow-800' },
    skipped: { label: 'Ignorado', className: 'bg-gray-100 text-gray-800' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
};

export const TestExecutions = () => {
  const { selectedProduct } = useProduct();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const { testPlans } = useTestPlans(selectedProduct?.id);
  const { testExecutions, loading, createTestExecution, updateTestExecution } = useTestExecutions(selectedPlanId);

  // Check for plan ID in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planFromUrl = urlParams.get('plan');
    if (planFromUrl && testPlans.some(p => p.id === planFromUrl)) {
      setSelectedPlanId(planFromUrl);
    }
  }, [testPlans]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getExecutionStats = () => {
    const stats = {
      total: testExecutions.length,
      passed: testExecutions.filter(e => e.status === 'passed').length,
      failed: testExecutions.filter(e => e.status === 'failed').length,
      blocked: testExecutions.filter(e => e.status === 'blocked').length,
      skipped: testExecutions.filter(e => e.status === 'skipped').length,
      pending: testExecutions.filter(e => e.status === 'pending').length,
    };
    return stats;
  };

  const stats = getExecutionStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Execuções de Teste" description="Carregando execuções..." />
        <Card className="animate-pulse">
          <CardHeader className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Execuções de Teste" 
        description="Execute e acompanhe o progresso dos testes"
      >
        <div className="flex items-center space-x-4">
          <ProductSelector />
          <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar plano" />
            </SelectTrigger>
            <SelectContent>
              {testPlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPlanId && (
            <TestExecutionDialog
              trigger={
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nova Execução</span>
                </Button>
              }
              onSave={createTestExecution}
              planId={selectedPlanId}
            />
          )}
        </div>
      </PageHeader>

      {!selectedProduct ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Selecione um produto</h3>
            <p className="text-muted-foreground text-center">
              Escolha um produto para visualizar as execuções de teste.
            </p>
          </CardContent>
        </Card>
      ) : testPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>
            <p className="text-muted-foreground text-center">
              Crie um plano de teste primeiro para poder executar testes.
            </p>
          </CardContent>
        </Card>
      ) : !selectedPlanId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Selecione um plano</h3>
            <p className="text-muted-foreground text-center">
              Escolha um plano de teste para visualizar suas execuções.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <Play className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Passou</p>
                  <p className="text-2xl font-bold">{stats.passed}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <XCircle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Falhou</p>
                  <p className="text-2xl font-bold">{stats.failed}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bloqueado</p>
                  <p className="text-2xl font-bold">{stats.blocked}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Minus className="h-8 w-8 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ignorado</p>
                  <p className="text-2xl font-bold">{stats.skipped}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Clock className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendente</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Executions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Execuções de Teste</CardTitle>
              <CardDescription>
                Histórico de execuções do plano selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testExecutions.length === 0 ? (
                <div className="text-center py-8">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma execução encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Execute os primeiros testes para começar a acompanhar o progresso.
                  </p>
                  <TestExecutionDialog
                    trigger={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Primeira Execução
                      </Button>
                    }
                    onSave={createTestExecution}
                    planId={selectedPlanId}
                  />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Caso de Teste</TableHead>
                      <TableHead>Executor</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tempo (min)</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testExecutions.map((execution) => (
                      <TableRow key={execution.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(execution.status)}
                            {getStatusBadge(execution.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">Caso #{execution.test_case_id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{execution.executor_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(execution.execution_date)}</TableCell>
                        <TableCell>
                          {execution.execution_time ? `${execution.execution_time} min` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <TestExecutionDialog
                            execution={execution}
                            trigger={
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            }
                            onSave={(data) => updateTestExecution(execution.id, data)}
                            planId={selectedPlanId}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};