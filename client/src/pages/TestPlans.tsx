import { PageHeader } from '@/components/ui/page-header';
import { ProductSelector } from '@/components/products/ProductSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Users, ClipboardList, Edit, Trash2, Play } from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';
import { useTestPlans } from '@/hooks/useTestPlans';
import { useReleases } from '@/hooks/useReleases';
import { TestPlanDialog } from '@/components/test-plans/TestPlanDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const getStatusBadge = (status: string) => {
  const statusConfig = {
    nao_iniciada: { label: 'Não Iniciada', className: 'bg-gray-100 text-gray-800' },
    em_andamento: { label: 'Em Andamento', className: 'bg-blue-100 text-blue-800' },
    concluida: { label: 'Concluída', className: 'bg-green-100 text-green-800' },
    interrompida: { label: 'Interrompida', className: 'bg-yellow-100 text-yellow-800' },
    cancelada: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
    aprovada: { label: 'Aprovada', className: 'bg-emerald-100 text-emerald-800' },
    rejeitada: { label: 'Rejeitada', className: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.nao_iniciada;
  return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
};

export const TestPlans = () => {
  const { selectedProduct } = useProduct();
  const { testPlans, loading, createTestPlan, updateTestPlan, deleteTestPlan } = useTestPlans(selectedProduct?.id);
  const { releases } = useReleases(selectedProduct?.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Planos de Teste" description="Carregando planos de teste..." />
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
        title="Planos de Teste" 
        description="Organize e execute testes por release"
      >
        <div className="flex items-center space-x-4">
          <ProductSelector />
          {selectedProduct && releases.length > 0 && (
            <TestPlanDialog
              trigger={
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Novo Plano</span>
                </Button>
              }
              onSave={createTestPlan}
              productId={selectedProduct.id}
              releases={releases}
            />
          )}
        </div>
      </PageHeader>

      {!selectedProduct ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Selecione um produto</h3>
            <p className="text-muted-foreground text-center">
              Escolha um produto para visualizar e gerenciar seus planos de teste.
            </p>
          </CardContent>
        </Card>
      ) : releases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma release encontrada</h3>
            <p className="text-muted-foreground text-center">
              Crie uma release primeiro para poder criar planos de teste.
            </p>
          </CardContent>
        </Card>
      ) : testPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie seu primeiro plano de teste para organizar a execução dos testes.
            </p>
            <TestPlanDialog
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Plano
                </Button>
              }
              onSave={createTestPlan}
              productId={selectedProduct.id}
              releases={releases}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {testPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <CardTitle>{plan.name}</CardTitle>
                        {getStatusBadge(plan.status)}
                      </div>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/test-executions?plan=${plan.id}`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Executar
                    </Button>
                    <TestPlanDialog
                      testPlan={plan}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                      onSave={(data) => updateTestPlan(plan.id, data)}
                      productId={selectedProduct.id}
                      releases={releases}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Plano de Teste</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Todas as execuções de teste deste plano também serão excluídas.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteTestPlan(plan.id)}>
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
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Release</div>
                    <div className="text-sm text-muted-foreground">
                      {releases.find(r => r.id === plan.release_id)?.name || 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Data de Início</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.start_date ? formatDate(plan.start_date) : 'Não definida'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Data de Fim</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.end_date ? formatDate(plan.end_date) : 'Não definida'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Criado em</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(plan.created_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};