
import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TestCoverageChart } from '@/components/dashboard/TestCoverageChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PageHeader } from '@/components/ui/page-header';
import { ProductSelector } from '@/components/products/ProductSelector';
import { useProduct } from '@/contexts/ProductContext';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  Rocket 
} from 'lucide-react';

export const Dashboard = () => {
  const { selectedProduct } = useProduct();
  const [stats, setStats] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    pendingTests: 0,
    totalProducts: 0,
    totalReleases: 0,
    totalExecutions: 0,
    activeTestSuites: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedProduct]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await fetch('/api/products');
      const products = productsResponse.ok ? await productsResponse.json() : [];
      
      // Fetch releases
      const releasesResponse = await fetch('/api/releases');
      const releases = releasesResponse.ok ? await releasesResponse.json() : [];
      
      // Fetch test suites
      const suitesResponse = await fetch('/api/test-suites');
      const testSuites = suitesResponse.ok ? await suitesResponse.json() : [];
      
      // Fetch test cases
      const casesResponse = await fetch('/api/test-cases');
      const testCases = casesResponse.ok ? await casesResponse.json() : [];
      
      // Fetch test executions
      const executionsResponse = await fetch('/api/test-executions');
      const executions = executionsResponse.ok ? await executionsResponse.json() : [];
      
      // Calculate stats
      const passedTests = executions.filter(e => e.status === 'passed').length;
      const failedTests = executions.filter(e => e.status === 'failed').length;
      const pendingTests = executions.filter(e => e.status === 'pending').length;
      
      setStats({
        totalTests: testCases.length,
        passedTests,
        failedTests,
        pendingTests,
        totalProducts: products.length,
        totalReleases: releases.length,
        totalExecutions: executions.length,
        activeTestSuites: testSuites.filter(s => s.status !== 'inactive').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPassRate = () => {
    const total = stats.passedTests + stats.failedTests;
    return total > 0 ? Math.round((stats.passedTests / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Dashboard" 
          description="Carregando dados do sistema..."
        >
          <ProductSelector />
        </PageHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Visão geral dos testes e atividades do sistema"
      >
        <ProductSelector />
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Testes"
          value={stats.totalTests}
          icon={TestTube}
          description="Casos de teste cadastrados"
        />
        <StatsCard
          title="Testes Aprovados"
          value={stats.passedTests}
          icon={CheckCircle}
          description={`Taxa de aprovação: ${getPassRate()}%`}
        />
        <StatsCard
          title="Testes Falharam"
          value={stats.failedTests}
          icon={XCircle}
          description="Requerem atenção"
        />
        <StatsCard
          title="Testes Pendentes"
          value={stats.pendingTests}
          icon={Clock}
          description="Aguardando execução"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Produtos Ativos"
          value={stats.totalProducts}
          icon={Package}
          description="Produtos cadastrados"
        />
        <StatsCard
          title="Releases"
          value={stats.totalReleases}
          icon={Rocket}
          description="Em diferentes estágios"
        />
        <StatsCard
          title="Suites de Teste"
          value={stats.activeTestSuites}
          icon={TestTube}
          description="Suites ativas"
        />
        <StatsCard
          title="Total Execuções"
          value={stats.totalExecutions}
          icon={Clock}
          description="Execuções registradas"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <TestCoverageChart />
        <RecentActivity />
      </div>
    </div>
  );
};
