import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestCase {
  id: string;
  title: string;
  description?: string;
  steps?: string;
  expected_result?: string;
  priority: string;
  execution?: {
    id: string;
    result: string;
    resultado: string;
    notes?: string;
    execution_date: string;
  } | null;
}

interface ExecutionDetails {
  id: string;
  execution_number: string;
  status: string;
  started_at: string;
  executor_name: string;
  test_plan_name: string;
  test_suite_name: string;
}

export const TestPlanExecution = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [execution, setExecution] = useState<ExecutionDetails | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [executionNotes, setExecutionNotes] = useState('');

  const executionId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    if (executionId) {
      fetchExecutionDetails();
      fetchTestCases();
    }
  }, [executionId]);

  const fetchExecutionDetails = async () => {
    try {
      const response = await fetch(`/api/test-plan-executions/${executionId}`);
      if (response.ok) {
        const data = await response.json();
        setExecution(data);
      }
    } catch (error) {
      console.error('Error fetching execution:', error);
    }
  };

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/test-plan-executions/${executionId}/test-cases`);
      if (response.ok) {
        const data = await response.json();
        setTestCases(data);
      }
    } catch (error) {
      console.error('Error fetching test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeTestCase = async (testCaseId: string, result: string, resultado: string, notes?: string) => {
    try {
      const response = await fetch('/api/test-case-executions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_plan_execution_id: executionId,
          test_case_id: testCaseId,
          result,
          resultado,
          notes,
          execution_date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await fetchTestCases(); // Refresh the test cases
        toast({
          title: "Sucesso",
          description: "Resultado do teste registrado.",
        });
      }
    } catch (error) {
      console.error('Error executing test case:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar o resultado.",
        variant: "destructive",
      });
    }
  };

  const completeExecution = async () => {
    try {
      const response = await fetch(`/api/test-plan-executions/${executionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'concluida',
          completed_at: new Date().toISOString(),
          notes: executionNotes,
        }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Execução concluída com sucesso.",
        });
        navigate('/test-plans');
      }
    } catch (error) {
      console.error('Error completing execution:', error);
      toast({
        title: "Erro",
        description: "Não foi possível concluir a execução.",
        variant: "destructive",
      });
    }
  };

  const getResultIcon = (result?: string) => {
    switch (result) {
      case 'passou':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'falhou':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'bloqueado':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getResultBadge = (result?: string) => {
    switch (result) {
      case 'passou':
        return <Badge className="bg-green-100 text-green-800">Passou</Badge>;
      case 'falhou':
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      case 'bloqueado':
        return <Badge className="bg-yellow-100 text-yellow-800">Bloqueado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const executedCount = testCases.filter(tc => tc.execution).length;
  const passedCount = testCases.filter(tc => tc.execution?.result === 'passou').length;
  const failedCount = testCases.filter(tc => tc.execution?.result === 'falhou').length;
  const blockedCount = testCases.filter(tc => tc.execution?.result === 'bloqueado').length;

  if (loading || !execution) {
    return (
      <div className="space-y-6">
        <PageHeader title="Execução de Plano de Teste" description="Carregando execução..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Execução ${execution.execution_number}`}
        description={`Plano: ${execution.test_plan_name}`}
      >
        <Button variant="outline" onClick={() => navigate('/test-plans')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Planos
        </Button>
      </PageHeader>

      {/* Execution Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{executedCount}/{testCases.length}</div>
                <div className="text-xs text-muted-foreground">Executados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{passedCount}</div>
                <div className="text-xs text-muted-foreground">Passou</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
                <div className="text-xs text-muted-foreground">Falhou</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{blockedCount}</div>
                <div className="text-xs text-muted-foreground">Bloqueado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Cases Execution Table */}
      <Card>
        <CardHeader>
          <CardTitle>Casos de Teste</CardTitle>
          <CardDescription>
            Execute cada caso de teste e registre o resultado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caso de Teste</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testCases.map((testCase) => (
                <TestCaseExecutionRow 
                  key={testCase.id}
                  testCase={testCase}
                  onExecute={executeTestCase}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Complete Execution */}
      {executedCount === testCases.length && (
        <Card>
          <CardHeader>
            <CardTitle>Finalizar Execução</CardTitle>
            <CardDescription>
              Todos os casos foram executados. Adicione observações finais e conclua a execução.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Observações finais sobre a execução..."
              value={executionNotes}
              onChange={(e) => setExecutionNotes(e.target.value)}
              rows={3}
            />
            <Button onClick={completeExecution}>
              Concluir Execução
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const TestCaseExecutionRow = ({ testCase, onExecute }: { 
  testCase: TestCase; 
  onExecute: (testCaseId: string, result: string, resultado: string, notes?: string) => void;
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState('');
  const [resultado, setResultado] = useState('');
  const [notes, setNotes] = useState('');

  const handleExecute = () => {
    if (!result || !resultado) return;
    
    onExecute(testCase.id, result, resultado, notes);
    setIsExecuting(false);
    setResult('');
    setResultado('');
    setNotes('');
  };

  const getResultIcon = (result?: string) => {
    switch (result) {
      case 'passou':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'falhou':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'bloqueado':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getResultBadge = (result?: string) => {
    switch (result) {
      case 'passou':
        return <Badge className="bg-green-100 text-green-800">Passou</Badge>;
      case 'falhou':
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      case 'bloqueado':
        return <Badge className="bg-yellow-100 text-yellow-800">Bloqueado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{testCase.title}</div>
          {testCase.description && (
            <div className="text-sm text-muted-foreground">{testCase.description}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{testCase.priority}</Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {getResultIcon(testCase.execution?.result)}
          {getResultBadge(testCase.execution?.result)}
        </div>
      </TableCell>
      <TableCell>
        {testCase.execution ? (
          <div className="text-sm">
            <div>{testCase.execution.resultado}</div>
            {testCase.execution.notes && (
              <div className="text-muted-foreground">{testCase.execution.notes}</div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {testCase.execution ? (
          <span className="text-sm text-muted-foreground">Executado</span>
        ) : isExecuting ? (
          <div className="space-y-2">
            <Select value={result} onValueChange={setResult}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Resultado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passou">Passou</SelectItem>
                <SelectItem value="falhou">Falhou</SelectItem>
                <SelectItem value="bloqueado">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Resultado (obrigatório)"
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              rows={2}
            />
            <Textarea
              placeholder="Observações (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={1}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleExecute} disabled={!result || !resultado}>
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsExecuting(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button size="sm" onClick={() => setIsExecuting(true)}>
            Executar
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};