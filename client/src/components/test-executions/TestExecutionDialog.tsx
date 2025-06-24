import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestExecution, TestCase } from '@/types/database';

interface TestExecutionDialogProps {
  trigger: React.ReactNode;
  execution?: TestExecution;
  onSave: (data: Omit<TestExecution, 'id' | 'created_at' | 'updated_at'>) => void;
  planId: string;
}

export const TestExecutionDialog = ({ trigger, execution, onSave, planId }: TestExecutionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    test_case_id: execution?.test_case_id || '',
    executor_name: execution?.executor_name || 'Demo User',
    status: execution?.status || 'pending' as const,
    execution_date: execution?.execution_date ? execution.execution_date.split('T')[0] : new Date().toISOString().split('T')[0],
    notes: execution?.notes || '',
    execution_time: execution?.execution_time?.toString() || '',
  });

  // Fetch test cases when dialog opens
  useEffect(() => {
    if (open && planId) {
      fetchTestCasesForPlan();
    }
  }, [open, planId]);

  const fetchTestCasesForPlan = async () => {
    try {
      setLoading(true);
      // First fetch all test suites for the product
      const response = await fetch('/api/test-suites');
      if (!response.ok) throw new Error('Failed to fetch test suites');
      const testSuites = await response.json();
      
      // Fetch test cases for all suites
      const allTestCases: TestCase[] = [];
      for (const suite of testSuites) {
        const casesResponse = await fetch(`/api/test-cases?test_suite_id=${suite.id}`);
        if (casesResponse.ok) {
          const cases = await casesResponse.json();
          allTestCases.push(...cases);
        }
      }
      setTestCases(allTestCases);
    } catch (error) {
      console.error('Error fetching test cases:', error);
      setTestCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      test_plan_id: planId,
      test_case_id: formData.test_case_id,
      executor_name: formData.executor_name,
      status: formData.status,
      execution_date: new Date(formData.execution_date).toISOString(),
      notes: formData.notes || undefined,
      execution_time: formData.execution_time ? parseInt(formData.execution_time) : undefined,
    };
    onSave(submitData);
    setOpen(false);
    if (!execution) {
      setFormData({
        test_case_id: '',
        executor_name: 'Demo User',
        status: 'pending',
        execution_date: new Date().toISOString().split('T')[0],
        notes: '',
        execution_time: '',
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
            {execution ? 'Editar Execução de Teste' : 'Nova Execução de Teste'}
          </DialogTitle>
          <DialogDescription>
            {execution ? 'Edite o resultado da execução.' : 'Registre uma nova execução de teste.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test_case_id">Caso de Teste</Label>
            <Select value={formData.test_case_id} onValueChange={(value) => setFormData({ ...formData, test_case_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um caso de teste" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Carregando casos de teste...</SelectItem>
                ) : testCases.length === 0 ? (
                  <SelectItem value="no-cases" disabled>Nenhum caso de teste encontrado</SelectItem>
                ) : (
                  testCases.map((testCase) => (
                    <SelectItem key={testCase.id} value={testCase.id}>
                      {testCase.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="executor_name">Executor</Label>
              <Input
                id="executor_name"
                value={formData.executor_name}
                onChange={(e) => setFormData({ ...formData, executor_name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="execution_date">Data de Execução</Label>
              <Input
                id="execution_date"
                type="date"
                value={formData.execution_date}
                onChange={(e) => setFormData({ ...formData, execution_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="passed">Passou</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                  <SelectItem value="skipped">Ignorado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="execution_time">Tempo (minutos)</Label>
              <Input
                id="execution_time"
                type="number"
                value={formData.execution_time}
                onChange={(e) => setFormData({ ...formData, execution_time: e.target.value })}
                placeholder="Ex: 30"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Adicione observações sobre a execução, bugs encontrados, etc..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.test_case_id}>
              {execution ? 'Salvar' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};