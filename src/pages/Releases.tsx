
import { PageHeader } from '@/components/ui/page-header';
import { ProductSelector } from '@/components/products/ProductSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Rocket, Calendar, Paperclip, Edit, Trash2 } from 'lucide-react';
import { ReleaseStatus } from '@/types/database';
import { useReleases } from '@/hooks/useReleases';
import { ReleaseDialog } from '@/components/releases/ReleaseDialog';
import { useProduct } from '@/contexts/ProductContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const getStatusBadge = (status: ReleaseStatus) => {
  const statusConfig = {
    development: { label: 'Desenvolvimento', variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
    ready_for_test: { label: 'Pronto para Teste', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
    testing: { label: 'Em Teste', variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800' },
    approved: { label: 'Aprovado', variant: 'secondary' as const, className: 'bg-green-100 text-green-800' },
    released: { label: 'Liberado', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
};

export const Releases = () => {
  const { selectedProduct } = useProduct();
  const { releases, loading, createRelease, updateRelease, deleteRelease } = useReleases(selectedProduct?.id);

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
        <PageHeader title="Releases" description="Carregando releases..." />
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
        title="Releases" 
        description="Gerencie releases e acompanhe o progresso dos testes"
      >
        <div className="flex items-center space-x-4">
          <ProductSelector />
          {selectedProduct && (
            <ReleaseDialog
              productId={selectedProduct.id}
              trigger={
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nova Release</span>
                </Button>
              }
              onSave={createRelease}
            />
          )}
        </div>
      </PageHeader>

      {!selectedProduct ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Rocket className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Selecione um produto</h3>
            <p className="text-muted-foreground text-center">
              Escolha um produto para visualizar e gerenciar suas releases.
            </p>
          </CardContent>
        </Card>
      ) : releases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Rocket className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma release encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie sua primeira release para começar a gerenciar os testes.
            </p>
            <ReleaseDialog
              productId={selectedProduct.id}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Release
                </Button>
              }
              onSave={createRelease}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {releases.map((release) => (
            <Card key={release.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Rocket className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>{release.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {release.changelog || 'Sem changelog'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(release.status)}
                    <ReleaseDialog
                      release={release}
                      productId={selectedProduct.id}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      }
                      onSave={(data) => updateRelease(release.id, data)}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a release "{release.name}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteRelease(release.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Ambiente de Teste</div>
                      {release.test_environment ? (
                        <a 
                          href={release.test_environment} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {release.test_environment}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">Não configurado</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Data de Criação</div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(release.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Anexos</div>
                      {release.attachments && release.attachments.length > 0 ? (
                        <div className="space-y-1">
                          {release.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Paperclip className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-primary hover:underline cursor-pointer">
                                {attachment}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhum anexo</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Progresso de Testes</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Suites Executadas</span>
                          <span>0/0</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="space-y-1">
                        <div className="text-green-600 font-bold">0</div>
                        <div className="text-muted-foreground">Passou</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-red-600 font-bold">0</div>
                        <div className="text-muted-foreground">Falhou</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-orange-600 font-bold">0</div>
                        <div className="text-muted-foreground">Pendente</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-2">
                  <Button size="sm" disabled>
                    Ver Execuções
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Iniciar Testes
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Adicionar Anexos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
