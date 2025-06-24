import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TestExecution } from '@/types/database';

export const useTestExecutions = (testPlanId?: string, testCaseId?: string) => {
  const [testExecutions, setTestExecutions] = useState<TestExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTestExecutions = async () => {
    try {
      setLoading(true);
      let url = '/api/test-executions';
      const params = new URLSearchParams();
      
      if (testPlanId) params.append('test_plan_id', testPlanId);
      if (testCaseId) params.append('test_case_id', testCaseId);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch test executions');
      const data = await response.json();
      setTestExecutions(data);
    } catch (error) {
      console.error('Error fetching test executions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as execuções de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestExecution = async (testExecutionData: Omit<TestExecution, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/test-executions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testExecutionData),
      });

      if (!response.ok) throw new Error('Failed to create test execution');
      const data = await response.json();

      setTestExecutions(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Execução de teste criada com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating test execution:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a execução de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTestExecution = async (id: string, testExecutionData: Partial<Omit<TestExecution, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await fetch(`/api/test-executions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testExecutionData),
      });

      if (!response.ok) throw new Error('Failed to update test execution');
      const data = await response.json();

      setTestExecutions(prev => prev.map(testExecution => 
        testExecution.id === id ? data : testExecution
      ));
      
      toast({
        title: "Sucesso",
        description: "Execução de teste atualizada com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating test execution:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a execução de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTestExecutions();
  }, [testPlanId, testCaseId]);

  return {
    testExecutions,
    loading,
    createTestExecution,
    updateTestExecution,
    refetch: fetchTestExecutions,
  };
};