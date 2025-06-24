import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestPlan, Release } from '@/types/database';

interface TestPlanDialogProps {
  trigger: React.ReactNode;
  testPlan?: TestPlan;
  onSave: (data: Omit<TestPlan, 'id' | 'created_at' | 'updated_at'>) => void;
  productId: string;
  releases: Release[];
}

export const TestPlanDialog = ({ trigger, testPlan, onSave, productId, releases }: TestPlanDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: testPlan?.name || '',
    description: testPlan?.description || '',
    release_id: testPlan?.release_id || '',
    start_date: testPlan?.start_date ? testPlan.start_date.split('T')[0] : '',
    end_date: testPlan?.end_date ? testPlan.end_date.split('T')[0] : '',
    status: testPlan?.status || 'planning' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      product_id: productId,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
    };
    onSave(submitData);
    setOpen(false);
    if (!testPlan) {
      setFormData({
        name: '',
        description: '',
        release_id: '',
        start_date: '',
        end_date: '',
        status: 'planning',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {testPlan ? 'Editar Plano de Teste' : 'Novo Plano de Teste'}
          </DialogTitle>
          <DialogDescription>
            {testPlan ? 'Edite as informações do plano de teste.' : 'Crie um novo plano para organizar a execução dos testes.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Plano de Teste - Release v1.2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="release_id">Release</Label>
            <Select value={formData.release_id} onValueChange={(value) => setFormData({ ...formData, release_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma release" />
              </SelectTrigger>
              <SelectContent>
                {releases.map((release) => (
                  <SelectItem key={release.id} value={release.id}>
                    {release.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Fim</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planejamento</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o objetivo deste plano de teste..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.release_id}>
              {testPlan ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};