
import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ProductSelector } from '@/components/products/ProductSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Rocket, Calendar, Paperclip, User } from 'lucide-react';
import { Release, ReleaseStatus } from '@/types/database';

const mockReleases: Release[] = [
  {
    id: '1',
    product_id: '1',
    name: 'Release v2.1.0',
    status: 'testing' as ReleaseStatus,
    changelog: 'Novos recursos de relatórios e correções de bugs',
    test_environment: 'https://staging.empresa.com',
    attachments: ['installer-v2.1.0.exe', 'release-notes.pdf'],
    created_at: '2024-06-15T10:00:00Z',
    updated_at: '2024-06-20T14:30:00Z',
  },
  {
    id: '2',
    product_id: '1',
    name: 'Release v2.0.5',
    status: 'approved' as ReleaseStatus,
    changelog: 'Correções críticas de segurança',
    test_environment: 'https://test.empresa.com',
    attachments: ['hotfix-v2.0.5.zip'],
    created_at: '2024-06-10T09:00:00Z',
    updated_at: '2024-06-18T16:45:00Z',
  },
  {
    id: '3',
    product_id: '1',
    name: 'Release v2.2.0',
    status: 'development' as ReleaseStatus,
    changelog: 'Novo módulo de integrações',
    test_environment: 'https://dev.empresa.com',
    attachments: [],
    created_at: '2024-06-20T11:15:00Z',
    updated_at: '2024-06-20T11:15:00Z',
  },
];

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
  const [releases] = useState<Release[]>(mockReleases);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Releases" 
        description="Gerencie releases e acompanhe o progresso dos testes"
      >
        <div className="flex items-center space-x-4">
          <ProductSelector />
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Release</span>
          </Button>
        </div>
      </PageHeader>

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
                      {release.changelog}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(release.status)}
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
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
                        <span>3/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="space-y-1">
                      <div className="text-green-600 font-bold">12</div>
                      <div className="text-muted-foreground">Passou</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-red-600 font-bold">2</div>
                      <div className="text-muted-foreground">Falhou</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-orange-600 font-bold">3</div>
                      <div className="text-muted-foreground">Pendente</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <Button size="sm">
                  Ver Execuções
                </Button>
                <Button variant="outline" size="sm">
                  Iniciar Testes
                </Button>
                <Button variant="outline" size="sm">
                  Adicionar Anexos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
