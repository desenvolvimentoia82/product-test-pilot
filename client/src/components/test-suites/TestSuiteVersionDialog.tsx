import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, RotateCcw, User, Clock, GitBranch } from 'lucide-react';
import { TestSuite, TestSuiteVersion } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface TestSuiteVersionDialogProps {
  suite: TestSuite;
  trigger: React.ReactNode;
  onRevert: () => void;
}

export const TestSuiteVersionDialog = ({ suite, trigger, onRevert }: TestSuiteVersionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<TestSuiteVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchVersions();
    }
  }, [open, suite.id]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/test-suites/${suite.id}/versions`);
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de versões.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (revision: number) => {
    try {
      const response = await fetch(`/api/test-suites/${suite.id}/revert/${revision}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Suite revertida para revisão ${revision} com sucesso.`,
        });
        setOpen(false);
        onRevert();
      } else {
        throw new Error('Failed to revert');
      }
    } catch (error) {
      console.error('Error reverting suite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível reverter a suite para esta versão.",
        variant: "destructive",
      });
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

  const parseChanges = (changesJson: string) => {
    try {
      const changes = JSON.parse(changesJson);
      const changesList = [];
      
      if (changes.revert_to) {
        return [`Revertido para revisão ${changes.revert_to}`];
      }
      
      if (changes.name) {
        changesList.push(`Nome: "${changes.name.from}" → "${changes.name.to}"`);
      }
      
      if (changes.description) {
        const fromDesc = changes.description.from || '(vazio)';
        const toDesc = changes.description.to || '(vazio)';
        changesList.push(`Descrição: "${fromDesc}" → "${toDesc}"`);
      }
      
      return changesList.length > 0 ? changesList : ['Nenhuma alteração detectada'];
    } catch {
      return ['Detalhes das alterações indisponíveis'];
    }
  };

  const getRevisionBadge = (revision: number) => {
    const isLatest = revision === suite.revision - 1;
    return (
      <Badge variant={isLatest ? "default" : "secondary"} className="flex items-center space-x-1">
        <GitBranch className="h-3 w-3" />
        <span>v{revision}</span>
        {isLatest && <span className="text-xs">(anterior)</span>}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Histórico de Versões - {suite.name}</span>
          </DialogTitle>
          <DialogDescription>
            Visualize o histórico de alterações e reverta para versões anteriores quando necessário.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current version info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <GitBranch className="h-4 w-4" />
                  <span>Versão Atual</span>
                </span>
                <Badge variant="default">v{suite.revision}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div><strong>Nome:</strong> {suite.name}</div>
                <div><strong>Descrição:</strong> {suite.description || 'Sem descrição'}</div>
                <div className="text-sm text-muted-foreground">
                  Última atualização: {formatDate(suite.updated_at)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Version history */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Histórico de Alterações</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse">Carregando histórico...</div>
                  </div>
                ) : versions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma alteração registrada ainda.</p>
                    <p className="text-sm">O histórico será criado quando a suite for editada.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Revisão</TableHead>
                        <TableHead>Resumo</TableHead>
                        <TableHead>Alterações</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {versions.map((version) => (
                        <TableRow key={version.id}>
                          <TableCell>
                            {getRevisionBadge(version.revision)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{version.change_summary}</div>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{version.changed_by}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {parseChanges(version.changes || '{}').map((change, index) => (
                                <div key={index} className="text-xs text-muted-foreground">
                                  {change}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(version.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-800">
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Reverter
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reverter para Revisão {version.revision}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação irá restaurar a suite para o estado da revisão {version.revision}. 
                                    Uma nova revisão será criada com as alterações revertidas.
                                    <br /><br />
                                    <strong>Nome da revisão {version.revision}:</strong> {version.name}
                                    <br />
                                    <strong>Descrição:</strong> {version.description || 'Sem descrição'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleRevert(version.revision)}
                                    className="bg-orange-600 hover:bg-orange-700"
                                  >
                                    Reverter
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};