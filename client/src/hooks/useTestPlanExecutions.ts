import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export const useTestPlanExecutions = (testPlanId?: string) => {
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchExecutions = async () => {
    try {
      setLoading(true);
      let url = '/api/test-plan-executions';
      if (testPlanId) url += `?test_plan_id=${testPlanId}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch executions');
      const data = await response.json();
      setExecutions(data);
    } catch (error) {
      console.error('Error fetching executions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as execuções.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startExecution = async (data: any) => {
    try {
      const response = await fetch('/api/test-plan-executions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to start execution');

      const newExecution = await response.json();
      setExecutions(prev => [...prev, newExecution]);
      
      toast({
        title: "Sucesso",
        description: `Execução iniciada: ${newExecution.execution_number}`,
      });
      
      return newExecution;
    } catch (error) {
      console.error('Error starting execution:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a execução.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateExecutionStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/test-plan-executions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) throw new Error('Failed to update execution');

      const updatedData = await response.json();
      setExecutions(prev => prev.map(execution => 
        execution.id === id ? updatedData : execution
      ));
      
      toast({
        title: "Sucesso",
        description: "Status da execução atualizado.",
      });
      
      return updatedData;
    } catch (error) {
      console.error('Error updating execution:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a execução.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchExecutions();
  }, [testPlanId]);

  return {
    executions,
    loading,
    startExecution,
    updateExecutionStatus,
    refetch: fetchExecutions,
  };
};