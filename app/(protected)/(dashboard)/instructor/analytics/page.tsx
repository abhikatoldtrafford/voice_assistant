'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  {
    title: 'Total Students',
    value: '2,345',
    icon: Users,
    trend: '+12%',
  },
  {
    title: 'Active Courses',
    value: '15',
    icon: BookOpen,
    trend: '+3',
  },
  {
    title: 'Completion Rate',
    value: '84%',
    icon: TrendingUp,
    trend: '+5%',
  },
  {
    title: 'Revenue',
    value: '$12,345',
    icon: DollarSign,
    trend: '+18%',
  },
];

const chartData = [
  { name: 'Jan', students: 65 },
  { name: 'Feb', students: 85 },
  { name: 'Mar', students: 120 },
  { name: 'Apr', students: 95 },
  { name: 'May', students: 150 },
  { name: 'Jun', students: 180 },
];

export default function InstructorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Enrollment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}