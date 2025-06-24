import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export const useTestPlans = (productId?: string) => {
  const [testPlans, setTestPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTestPlans = async () => {
    try {
      setLoading(true);
      let url = "/api/test-plans";
      if (productId) url += `?product_id=${productId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch test plans");
      const data = await response.json();
      setTestPlans(data);
    } catch (error) {
      console.error("Error fetching test plans:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos de teste.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestPlan = async (data: any) => {
    try {
      const response = await fetch("/api/test-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.log("Error data:", errorData);

        throw new Error(
          errorData.error || `Failed to create test plan (${response.status})`,
        );
      }

      const newTestPlan = await response.json();
      setTestPlans((prev) => [...prev, newTestPlan]);

      toast({
        title: "Sucesso",
        description: "Plano de teste criado com sucesso.",
      });

      return newTestPlan;
    } catch (error) {
      console.error("Error creating test plan:", error);
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível criar o plano de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTestPlan = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/test-plans/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update test plan");

      const updatedData = await response.json();
      setTestPlans((prev) =>
        prev.map((plan) => (plan.id === id ? updatedData : plan)),
      );

      toast({
        title: "Sucesso",
        description: "Plano de teste atualizado com sucesso.",
      });

      return updatedData;
    } catch (error) {
      console.error("Error updating test plan:", error);
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
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete test plan");

      setTestPlans((prev) => prev.filter((plan) => plan.id !== id));
      toast({
        title: "Sucesso",
        description: "Plano de teste excluído com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting test plan:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o plano de teste.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (productId) {
      fetchTestPlans();
    }
  }, [productId]);

  return {
    testPlans,
    loading,
    createTestPlan,
    updateTestPlan,
    deleteTestPlan,
    refetch: fetchTestPlans,
  };
};
