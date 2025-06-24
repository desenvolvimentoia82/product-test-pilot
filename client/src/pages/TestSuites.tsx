
import { PageHeader } from '@/components/ui/page-header';
import { ProductSelector } from '@/components/products/ProductSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TestTube, Clock, User, History, Edit, Trash2, PlayCircle, Eye } from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';
import { useTestSuites } from '@/hooks/useTestSuites';
import { useTestCases } from '@/hooks/useTestCases';
import { TestSuiteDialog } from '@/components/test-suites/TestSuiteDialog';
import { TestCaseDialog } from '@/components/test-suites/TestCaseDialog';
import { TestCasesViewDialog } from '@/components/test-suites/TestCasesViewDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const TestSuites = () => {
  const { selectedProduct } = useProduct();
  const { testSuites, loading, createTestSuite, updateTestSuite, deleteTestSuite } = useTestSuites(selectedProduct?.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Suites de Teste" description="Carregando suites de teste..." />
        <div className="grid gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-4">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suites de Teste" 
        description="Organize seus casos de teste em suites por funcionalidade"
      >
        <div className="flex items-center space-x-4">
          <ProductSelector />
          {selectedProduct && (
            <TestSuiteDialog
              trigger={
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nova Suite</span>
                </Button>
              }
              onSave={(data) => createTestSuite({ ...data, product_id: selectedProduct.id })}
            />
          )}
        </div>
      </PageHeader>

      {!selectedProduct ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Selecione um produto</h3>
            <p className="text-muted-foreground text-center">
              Escolha um produto para visualizar e gerenciar suas suites de teste.
            </p>
          </CardContent>
        </Card>
      ) : testSuites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma suite encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie sua primeira suite de teste para começar a organizar os casos de teste.
            </p>
            <TestSuiteDialog
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Suite
                </Button>
              }
              onSave={(data) => createTestSuite({ ...data, product_id: selectedProduct.id })}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {testSuites.map((suite) => (
            <TestSuiteCard
              key={suite.id}
              suite={suite}
              onUpdate={updateTestSuite}
              onDelete={deleteTestSuite}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TestSuiteCard = ({ suite, onUpdate, onDelete, formatDate }: {
  suite: any;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}) => {
  const { testCases, loading: casesLoading } = useTestCases(suite.id);

  const getStatusCounts = () => {
    const counts = {
      active: testCases.filter(tc => tc.status === 'active').length,
      inactive: testCases.filter(tc => tc.status === 'inactive').length,
      deprecated: testCases.filter(tc => tc.status === 'deprecated').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TestTube className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>{suite.name}</CardTitle>
              <CardDescription className="mt-1">
                {suite.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TestSuiteDialog
              suite={suite}
              trigger={
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              }
              onSave={(data) => onUpdate(suite.id, data)}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Suite de Teste</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os casos de teste desta suite também serão excluídos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(suite.id)}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Casos de Teste</div>
            <div className="text-2xl font-bold">{casesLoading ? '...' : testCases.length}</div>
            <div className="flex space-x-1">
              <Badge variant="secondary" className="test-status-passed text-xs">
                {statusCounts.active} Ativos
              </Badge>
              <Badge variant="secondary" className="test-status-blocked text-xs">
                {statusCounts.inactive} Inativos
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Última Execução</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(suite.updated_at)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Prioridade</div>
            <div className="flex space-x-1">
              <Badge variant="outline" className="text-xs">
                {testCases.filter(tc => tc.priority === 'high' || tc.priority === 'critical').length} Alta/Crítica
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Ações</div>
            <div className="flex space-x-2">
              <TestCaseDialog
                trigger={
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Caso
                  </Button>
                }
                onSave={async (data) => {
                  try {
                    const response = await fetch('/api/test-cases', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        ...data,
                        test_suite_id: suite.id,
                      }),
                    });
                    
                    if (!response.ok) throw new Error('Failed to create test case');
                    
                    // Refresh the page to show the new test case
                    window.location.reload();
                  } catch (error) {
                    console.error('Error creating test case:', error);
                  }
                }}
              />
              <TestCasesViewDialog 
                suite={suite}
                trigger={
                  <Button variant="outline" size="sm">
                    <TestTube className="h-4 w-4 mr-1" />
                    Ver Casos
                  </Button>
                }
              />
              <Button variant="outline" size="sm">
                <PlayCircle className="h-4 w-4 mr-1" />
                Executar
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>Criado em {formatDate(suite.created_at)}</div>
            <div className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Revisão {suite.revision || 1}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
