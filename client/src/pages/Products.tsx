
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, TestTube, Rocket, Settings, Edit, Trash2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductDialog } from '@/components/products/ProductDialog';
import { useProduct } from '@/contexts/ProductContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const Products = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { setSelectedProduct } = useProduct();

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Produtos" description="Carregando produtos..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
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
        title="Produtos" 
        description="Gerencie produtos e suas configurações de teste"
      >
        <ProductDialog
          trigger={
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Novo Produto</span>
            </Button>
          }
          onSave={createProduct}
        />
      </PageHeader>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando seu primeiro produto para gerenciar testes e releases.
            </p>
            <ProductDialog
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Produto
                </Button>
              }
              onSave={createProduct}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="w-fit">
                    {product.key}
                  </Badge>
                  <div className="flex space-x-1">
                    <ProductDialog
                      product={product}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                      onSave={(data) => updateProduct(product.id, data)}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o produto "{product.name}"? 
                            Esta ação não pode ser desfeita e também removerá todas as releases associadas.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProduct(product.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description || 'Sem descrição'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <TestTube className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">-</div>
                      <div className="text-xs text-muted-foreground">Suites</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <Rocket className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">-</div>
                      <div className="text-xs text-muted-foreground">Releases</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-2xl font-bold">-</div>
                      <div className="text-xs text-muted-foreground">Membros</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSelectProduct(product)}
                    >
                      Ver Detalhes
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleSelectProduct(product)}
                    >
                      Selecionar
                    </Button>
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
