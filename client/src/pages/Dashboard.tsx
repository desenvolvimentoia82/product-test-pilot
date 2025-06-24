
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TestCoverageChart } from '@/components/dashboard/TestCoverageChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { PageHeader } from '@/components/ui/page-header';
import { ProductSelector } from '@/components/products/ProductSelector';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  Rocket 
} from 'lucide-react';

export const Dashboard = () => {
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
          value="156"
          icon={TestTube}
          description="Casos de teste ativos"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Testes Aprovados"
          value="128"
          icon={CheckCircle}
          description="Taxa de aprovação: 82%"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Testes Falharam"
          value="18"
          icon={XCircle}
          description="Requerem atenção"
          trend={{ value: -8, isPositive: false }}
        />
        <StatsCard
          title="Testes Pendentes"
          value="10"
          icon={Clock}
          description="Aguardando execução"
          trend={{ value: -15, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Produtos Ativos"
          value="4"
          icon={Package}
          description="Em desenvolvimento"
        />
        <StatsCard
          title="Releases Ativas"
          value="7"
          icon={Rocket}
          description="Em diferentes estágios"
        />
        <StatsCard
          title="Cobertura de Testes"
          value="87%"
          icon={TestTube}
          description="Meta: 90%"
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Execuções Hoje"
          value="23"
          icon={Clock}
          description="Testes executados"
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <TestCoverageChart />
        <RecentActivity />
      </div>
    </div>
  );
};
