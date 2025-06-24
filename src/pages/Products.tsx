
import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, TestTube, Rocket, Settings } from 'lucide-react';
import { Product } from '@/types/database';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Sistema Web Principal',
    key: 'WEB',
    description: 'Sistema principal da empresa com funcionalidades de gestão e relatórios',
    created_at: '2024-01-15',
    updated_at: '2024-06-20',
  },
  {
    id: '2',
    name: 'Aplicativo Mobile',
    key: 'MOBILE',
    description: 'App mobile para iOS e Android com funcionalidades básicas',
    created_at: '2024-02-01',
    updated_at: '2024-06-18',
  },
  {
    id: '3',
    name: 'API Gateway',
    key: 'API',
    description: 'Gateway de APIs para integração com sistemas externos',
    created_at: '2024-03-10',
    updated_at: '2024-06-15',
  },
];

export const Products = () => {
  const [products] = useState<Product[]>(mockProducts);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Produtos" 
        description="Gerencie produtos e suas configurações de teste"
      >
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Produto</span>
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="w-fit">
                  {product.key}
                </Badge>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <TestTube className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Suites</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Rocket className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-muted-foreground">Releases</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Membros</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" className="flex-1">
                    Selecionar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
