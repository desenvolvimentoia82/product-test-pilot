import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Play } from 'lucide-react';

interface TestPlanExecutionDialogProps {
  trigger: React.ReactNode;
  testPlanId: string;
  testPlanName: string;
  onStartExecution: (data: { executor_name: string; notes?: string }) => void;
}

export const TestPlanExecutionDialog = ({ trigger, testPlanId, testPlanName, onStartExecution }: TestPlanExecutionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    executor_name: 'Demo User',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartExecution(formData);
    setOpen(false);
    setFormData({
      executor_name: 'Demo User',
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Iniciar Execução</span>
          </DialogTitle>
          <DialogDescription>
            Inicie uma nova execução do plano "{testPlanName}". Todos os casos de teste da suite associada serão executados.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="executor_name">Executor</Label>
            <Input
              id="executor_name"
              value={formData.executor_name}
              onChange={(e) => setFormData({ ...formData, executor_name: e.target.value })}
              placeholder="Nome do executor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações sobre esta execução..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Play className="h-4 w-4 mr-2" />
              Iniciar Execução
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};