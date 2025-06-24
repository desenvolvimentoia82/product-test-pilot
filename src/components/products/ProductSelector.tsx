
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/database';
import { useProduct } from '@/contexts/ProductContext';

export const ProductSelector = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { selectedProduct, setSelectedProduct } = useProduct();

  useEffect(() => {
    // Simular carregamento de produtos
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Sistema Web',
        key: 'WEB',
        description: 'Sistema principal da empresa',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'App Mobile',
        key: 'MOBILE',
        description: 'Aplicativo mobile',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    setProducts(mockProducts);
    
    // Selecionar o primeiro produto automaticamente se não houver nenhum selecionado
    if (!selectedProduct && mockProducts.length > 0) {
      setSelectedProduct(mockProducts[0]);
    }
  }, [selectedProduct, setSelectedProduct]);

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
  };

  return (
    <div className="w-64">
      <Select value={selectedProduct?.id || ""} onValueChange={handleProductChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um produto" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{product.key}</span>
                <span className="text-muted-foreground">-</span>
                <span>{product.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
