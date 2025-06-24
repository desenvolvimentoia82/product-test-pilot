
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProduct } from '@/contexts/ProductContext';
import { useProducts } from '@/hooks/useProducts';

export const ProductSelector = () => {
  const { products, loading } = useProducts();
  const { selectedProduct, setSelectedProduct } = useProduct();

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
  };

  if (loading) {
    return (
      <div className="w-64">
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Carregando produtos..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

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
