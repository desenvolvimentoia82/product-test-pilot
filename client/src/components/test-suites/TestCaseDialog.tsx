import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestCase } from '@/types/database';

interface TestCaseDialogProps {
  trigger: React.ReactNode;
  testCase?: TestCase;
  onSave: (data: Omit<TestCase, 'id' | 'created_at' | 'updated_at' | 'test_suite_id'>) => void;
}

export const TestCaseDialog = ({ trigger, testCase, onSave }: TestCaseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: testCase?.title || '',
    description: testCase?.description || '',
    steps: testCase?.steps || '',
    expected_result: testCase?.expected_result || '',
    priority: testCase?.priority || 'medium' as const,
    status: testCase?.status || 'active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
    if (!testCase) {
      setFormData({
        title: '',
        description: '',
        steps: '',
        expected_result: '',
        priority: 'medium',
        status: 'active',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testCase ? 'Editar Caso de Teste' : 'Novo Caso de Teste'}
          </DialogTitle>
          <DialogDescription>
            {testCase ? 'Edite as informações do caso de teste.' : 'Crie um novo caso de teste detalhado.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Teste de login com credenciais válidas"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="deprecated">Descontinuado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o objetivo do teste..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="steps">Passos</Label>
            <Textarea
              id="steps"
              value={formData.steps}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              placeholder="1. Acessar a página de login&#10;2. Inserir email válido&#10;3. Inserir senha válida&#10;4. Clicar em 'Entrar'"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_result">Resultado Esperado</Label>
            <Textarea
              id="expected_result"
              value={formData.expected_result}
              onChange={(e) => setFormData({ ...formData, expected_result: e.target.value })}
              placeholder="O usuário deve ser redirecionado para o dashboard..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {testCase ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};