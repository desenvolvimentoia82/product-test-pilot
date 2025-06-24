
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, TestTube, Rocket } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'test_execution',
    title: 'Suite de Login executada',
    user: 'Ana Silva',
    time: '2 min atrás',
    status: 'passed',
    icon: TestTube,
  },
  {
    id: 2,
    type: 'release',
    title: 'Release v2.1.0 aprovada',
    user: 'Carlos Santos',
    time: '15 min atrás',
    status: 'approved',
    icon: Rocket,
  },
  {
    id: 3,
    type: 'test_execution',
    title: 'Suite de Pagamento falhou',
    user: 'Maria Oliveira',
    time: '1h atrás',
    status: 'failed',
    icon: TestTube,
  },
  {
    id: 4,
    type: 'test_creation',
    title: 'Nova suite "API Tests" criada',
    user: 'João Costa',
    time: '2h atrás',
    status: 'created',
    icon: TestTube,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'passed':
      return <Badge variant="secondary" className="test-status-passed">Passou</Badge>;
    case 'failed':
      return <Badge variant="secondary" className="test-status-failed">Falhou</Badge>;
    case 'approved':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Aprovado</Badge>;
    case 'created':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Criado</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const RecentActivity = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
              <div className="flex-shrink-0">
                <activity.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {activity.user}
                  </span>
                  <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
