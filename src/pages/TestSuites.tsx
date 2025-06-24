
import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { ProductSelector } from '@/components/products/ProductSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TestTube, Clock, User, History } from 'lucide-react';
import { TestSuite } from '@/types/database';

const mockTestSuites: TestSuite[] = [
  {
    id: '1',
    product_id: '1',
    name: 'Suite de Autenticação',
    description: 'Testes relacionados ao login, logout e recuperação de senha',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-20T14:30:00Z',
  },
  {
    id: '2',
    product_id: '1',
    name: 'Suite de Pagamentos',
    description: 'Testes do fluxo de pagamentos e transações',
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-06-18T16:45:00Z',
  },
  {
    id: '3',
    product_id: '1',
    name: 'Suite de Relatórios',
    description: 'Testes de geração e exportação de relatórios',
    created_at: '2024-03-10T11:15:00Z',
    updated_at: '2024-06-15T13:20:00Z',
  },
];

export const TestSuites = () => {
  const [testSuites] = useState<TestSuite[]>(mockTestSuites);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suites de Teste" 
        description="Organize seus casos de teste em suites por funcionalidade"
      >
        <div className="flex items-center space-x-4">
          <ProductSelector />
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Suite</span>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        {testSuites.map((suite) => (
          <Card key={suite.id} className="hover:shadow-md transition-shadow">
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
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    Histórico
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Casos de Teste</div>
                  <div className="text-2xl font-bold">15</div>
                  <div className="flex space-x-1">
                    <Badge variant="secondary" className="test-status-passed text-xs">
                      12 Ativos
                    </Badge>
                    <Badge variant="secondary" className="test-status-blocked text-xs">
                      3 Inativos
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Última Execução</div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Há 2 dias</span>
                  </div>
                  <Badge variant="secondary" className="test-status-passed">
                    Passou
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Última Atualização</div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Ana Silva</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(suite.updated_at)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Revisões</div>
                  <div className="text-2xl font-bold">8</div>
                  <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
                    Ver histórico completo
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button size="sm">
                  Ver Casos de Teste
                </Button>
                <Button variant="outline" size="sm">
                  Executar Suite
                </Button>
                <Button variant="outline" size="sm">
                  Clonar Suite
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
