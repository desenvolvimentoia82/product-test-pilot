
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Release, ReleaseStatus } from '@/types/database';

interface ReleaseDialogProps {
  release?: Release;
  productId: string;
  trigger: React.ReactNode;
  onSave: (releaseData: Omit<Release, 'id' | 'created_at' | 'updated_at'>) => Promise<Release | null>;
}

const statusOptions: { value: ReleaseStatus; label: string }[] = [
  { value: 'development', label: 'Desenvolvimento' },
  { value: 'ready_for_test', label: 'Pronto para Teste' },
  { value: 'testing', label: 'Em Teste' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'released', label: 'Liberado' },
];

export const ReleaseDialog = ({ release, productId, trigger, onSave }: ReleaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: release?.name || '',
    status: release?.status || 'development' as ReleaseStatus,
    changelog: release?.changelog || '',
    test_environment: release?.test_environment || '',
    product_id: productId,
    attachments: release?.attachments || [],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await onSave(formData);
    if (result) {
      setOpen(false);
      if (!release) {
        setFormData({
          name: '',
          status: 'development',
          changelog: '',
          test_environment: '',
          product_id: productId,
          attachments: [],
        });
      }
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {release ? 'Editar Release' : 'Nova Release'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Release</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: v1.2.0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: ReleaseStatus) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="changelog">Changelog</Label>
            <Textarea
              id="changelog"
              value={formData.changelog}
              onChange={(e) => setFormData(prev => ({ ...prev, changelog: e.target.value }))}
              rows={3}
              placeholder="Descreva as mudanças desta release..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="test_environment">Ambiente de Teste</Label>
            <Input
              id="test_environment"
              value={formData.test_environment}
              onChange={(e) => setFormData(prev => ({ ...prev, test_environment: e.target.value }))}
              placeholder="https://staging.empresa.com"
              type="url"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
