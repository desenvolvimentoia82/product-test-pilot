
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Aprovados', value: 65, color: '#10b981' },
  { name: 'Falharam', value: 15, color: '#ef4444' },
  { name: 'Pendentes', value: 12, color: '#f59e0b' },
  { name: 'Bloqueados', value: 8, color: '#6b7280' },
];

export const TestCoverageChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Distribuição de Testes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
