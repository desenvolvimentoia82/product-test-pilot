import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TestSuite } from '@/types/database';

export const useTestSuites = (productId?: string) => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTestSuites = async () => {
    try {
      setLoading(true);
      let url = '/api/test-suites';
      if (productId) url += `?product_id=${productId}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch test suites');
      const data = await response.json();
      setTestSuites(data);
    } catch (error) {
      console.error('Error fetching test suites:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as suites de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestSuite = async (testSuiteData: Omit<TestSuite, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/test-suites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testSuiteData),
      });

      if (!response.ok) throw new Error('Failed to create test suite');
      const data = await response.json();

      setTestSuites(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Suite de teste criada com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating test suite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a suite de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTestSuite = async (id: string, testSuiteData: Partial<Omit<TestSuite, 'id' | 'created_at' | 'updated_at'>> & { change_summary?: string }) => {
    try {
      // Get current suite to increment revision
      const currentSuite = testSuites.find(suite => suite.id === id);
      const currentRevision = currentSuite?.revision || 1;
      
      const response = await fetch(`/api/test-suites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testSuiteData),
      });

      if (!response.ok) throw new Error('Failed to update test suite');
      const data = await response.json();

      setTestSuites(prev => prev.map(testSuite => 
        testSuite.id === id ? data : testSuite
      ));
      
      toast({
        title: "Sucesso",
        description: `Suite atualizada com sucesso. Revisão ${data.revision}`,
      });
      
      return data;
    } catch (error) {
      console.error('Error updating test suite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a suite de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTestSuite = async (id: string) => {
    try {
      const response = await fetch(`/api/test-suites/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete test suite');

      setTestSuites(prev => prev.filter(testSuite => testSuite.id !== id));
      toast({
        title: "Sucesso",
        description: "Suite de teste excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting test suite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a suite de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTestSuites();
  }, [productId]);

  return {
    testSuites,
    loading,
    createTestSuite,
    updateTestSuite,
    deleteTestSuite,
    refetch: fetchTestSuites,
  };
};