
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Release } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useReleases = (productId?: string) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReleases = async () => {
    try {
      let query = supabase
        .from('releases')
        .select('*, product:products(*)')
        .order('created_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReleases(data || []);
    } catch (error) {
      console.error('Error fetching releases:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as releases',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createRelease = async (releaseData: Omit<Release, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('releases')
        .insert([releaseData])
        .select('*, product:products(*)')
        .single();

      if (error) throw error;
      
      setReleases(prev => [data, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Release criada com sucesso',
      });
      return data;
    } catch (error) {
      console.error('Error creating release:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a release',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateRelease = async (id: string, updates: Partial<Release>) => {
    try {
      const { data, error } = await supabase
        .from('releases')
        .update(updates)
        .eq('id', id)
        .select('*, product:products(*)')
        .single();

      if (error) throw error;
      
      setReleases(prev => prev.map(r => r.id === id ? data : r));
      toast({
        title: 'Sucesso',
        description: 'Release atualizada com sucesso',
      });
      return data;
    } catch (error) {
      console.error('Error updating release:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a release',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteRelease = async (id: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setReleases(prev => prev.filter(r => r.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Release removida com sucesso',
      });
    } catch (error) {
      console.error('Error deleting release:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a release',
        variant: 'destructive',
      });
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
