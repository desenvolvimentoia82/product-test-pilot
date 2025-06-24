import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TestCase } from '@/types/database';

export const useTestCases = (testSuiteId?: string) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTestCases = async () => {
    if (!testSuiteId) {
      setTestCases([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/test-cases?test_suite_id=${testSuiteId}`);
      if (!response.ok) throw new Error('Failed to fetch test cases');
      const data = await response.json();
      setTestCases(data);
    } catch (error) {
      console.error('Error fetching test cases:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os casos de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestCase = async (testCaseData: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/test-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCaseData),
      });

      if (!response.ok) throw new Error('Failed to create test case');
      const data = await response.json();

      setTestCases(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Caso de teste criado com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating test case:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o caso de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTestCase = async (id: string, testCaseData: Partial<Omit<TestCase, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await fetch(`/api/test-cases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCaseData),
      });

      if (!response.ok) throw new Error('Failed to update test case');
      const data = await response.json();

      setTestCases(prev => prev.map(testCase => 
        testCase.id === id ? data : testCase
      ));
      
      toast({
        title: "Sucesso",
        description: "Caso de teste atualizado com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating test case:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o caso de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTestCase = async (id: string) => {
    try {
      const response = await fetch(`/api/test-cases/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete test case');

      setTestCases(prev => prev.filter(testCase => testCase.id !== id));
      toast({
        title: "Sucesso",
        description: "Caso de teste excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting test case:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o caso de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, [testSuiteId]);

  return {
    testCases,
    loading,
    createTestCase,
    updateTestCase,
    deleteTestCase,
    refetch: fetchTestCases,
  };
};