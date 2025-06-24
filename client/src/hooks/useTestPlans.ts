import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TestPlan } from '@/types/database';

export const useTestPlans = (productId?: string, releaseId?: string) => {
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTestPlans = async () => {
    try {
      setLoading(true);
      let url = '/api/test-plans';
      const params = new URLSearchParams();
      
      if (productId) params.append('product_id', productId);
      if (releaseId) params.append('release_id', releaseId);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch test plans');
      const data = await response.json();
      setTestPlans(data);
    } catch (error) {
      console.error('Error fetching test plans:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestPlan = async (testPlanData: Omit<TestPlan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/test-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPlanData),
      });

      if (!response.ok) throw new Error('Failed to create test plan');
      const data = await response.json();

      setTestPlans(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Plano de teste criado com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating test plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o plano de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTestPlan = async (id: string, testPlanData: Partial<Omit<TestPlan, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await fetch(`/api/test-plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPlanData),
      });

      if (!response.ok) throw new Error('Failed to update test plan');
      const data = await response.json();

      setTestPlans(prev => prev.map(testPlan => 
        testPlan.id === id ? data : testPlan
      ));
      
      toast({
        title: "Sucesso",
        description: "Plano de teste atualizado com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating test plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o plano de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTestPlan = async (id: string) => {
    try {
      const response = await fetch(`/api/test-plans/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete test plan');

      setTestPlans(prev => prev.filter(testPlan => testPlan.id !== id));
      toast({
        title: "Sucesso",
        description: "Plano de teste excluído com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting test plan:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o plano de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTestPlans();
  }, [productId, releaseId]);

  return {
    testPlans,
    loading,
    createTestPlan,
    updateTestPlan,
    deleteTestPlan,
    refetch: fetchTestPlans,
  };
};