import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Release } from '@/types/database';

export const useReleases = (productId?: string) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReleases = async () => {
    if (!productId) {
      setReleases([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/releases?product_id=${productId}`);
      if (!response.ok) throw new Error('Failed to fetch releases');
      const data = await response.json();
      setReleases(data);
    } catch (error) {
      console.error('Error fetching releases:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as releases.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRelease = async (releaseData: Omit<Release, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(releaseData),
      });

      if (!response.ok) throw new Error('Failed to create release');
      const data = await response.json();

      setReleases(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Release criada com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating release:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a release.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRelease = async (id: string, releaseData: Partial<Omit<Release, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await fetch(`/api/releases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(releaseData),
      });

      if (!response.ok) throw new Error('Failed to update release');
      const data = await response.json();

      setReleases(prev => prev.map(release => 
        release.id === id ? data : release
      ));
      
      toast({
        title: "Sucesso",
        description: "Release atualizada com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating release:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a release.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteRelease = async (id: string) => {
    try {
      const response = await fetch(`/api/releases/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete release');

      setReleases(prev => prev.filter(release => release.id !== id));
      toast({
        title: "Sucesso",
        description: "Release excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting release:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a release.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchReleases();
  }, [productId]);

  return {
    releases,
    loading,
    createRelease,
    updateRelease,
    deleteRelease,
    refetch: fetchReleases,
  };
};