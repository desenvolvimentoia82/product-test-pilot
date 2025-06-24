import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Play } from 'lucide-react';
import { useTestCases } from '@/hooks/useTestCases';
import { TestCaseDialog } from './TestCaseDialog';
import { TestCase, TestSuite } from '@/types/database';

interface TestCasesViewDialogProps {
  suite: TestSuite;
  trigger: React.ReactNode;
}

export const TestCasesViewDialog = ({ suite, trigger }: TestCasesViewDialogProps) => {
  const [open, setOpen] = useState(false);
  const { testCases, loading, createTestCase, updateTestCase, deleteTestCase } = useTestCases(suite.id);

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: 'Baixa', className: 'bg-gray-100 text-gray-800' },
      medium: { label: 'Média', className: 'bg-blue-100 text-blue-800' },
      high: { label: 'Alta', className: 'bg-orange-100 text-orange-800' },
      critical: { label: 'Crítica', className: 'bg-red-100 text-red-800' },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inativo', className: 'bg-gray-100 text-gray-800' },
      deprecated: { label: 'Descontinuado', className: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant="secondary" className={config.className}>{config.label}</Badge>;
  };

  const handleCreateTestCase = async (data: Omit<TestCase, 'id' | 'created_at' | 'updated_at' | 'test_suite_id'>) => {
    try {
      await createTestCase({
        ...data,
        test_suite_id: suite.id,
      });
    } catch (error) {
      console.error('Error creating test case:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Casos de Teste - {suite.name}</DialogTitle>
          <DialogDescription>
            Gerencie os casos de teste desta suite. Você pode criar, editar e excluir casos de teste.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with stats and create button */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="text-sm">
                <span className="font-medium">Total: </span>
                <span className="text-muted-foreground">{testCases.length}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Ativos: </span>
                <span className="text-muted-foreground">
                  {testCases.filter(tc => tc.status === 'active').length}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Alta/Crítica: </span>
                <span className="text-muted-foreground">
                  {testCases.filter(tc => tc.priority === 'high' || tc.priority === 'critical').length}
                </span>
              </div>
            </div>
            
            <TestCaseDialog
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Caso
                </Button>
              }
              onSave={handleCreateTestCase}
            />
          </div>

          {/* Test cases table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Carregando casos de teste...</div>
            </div>
          ) : testCases.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum caso de teste</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Crie o primeiro caso de teste para esta suite.
                </p>
                <TestCaseDialog
                  trigger={
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Primeiro Caso
                    </Button>
                  }
                  onSave={handleCreateTestCase}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Casos de Teste</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testCases.map((testCase) => (
                      <TableRow key={testCase.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{testCase.title}</div>
                            {testCase.description && (
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {testCase.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(testCase.priority)}</TableCell>
                        <TableCell>{getStatusBadge(testCase.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(testCase.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <TestCaseDialog
                              testCase={testCase}
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                              onSave={(data) => updateTestCase(testCase.id, data)}
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir Caso de Teste</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. O caso de teste "{testCase.title}" será excluído permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteTestCase(testCase.id)}>
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};