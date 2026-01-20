/**
 * Dashboard page for HR Management Platform
 * Main landing page after authentication
 */

'use client';

import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const isRTL = typeof window !== 'undefined' && document.documentElement.dir === 'rtl';

  // Mock dashboard data - replace with real data
  const dashboardStats = [
    {
      title: 'Total Employees',
      titleAr: 'إجمالي الموظفين',
      value: '247',
      change: '+12',
      changeType: 'increase' as const,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Departments',
      titleAr: 'الإدارات النشطة',
      value: '12',
      change: '+1',
      changeType: 'increase' as const,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Leave Requests',
      titleAr: 'طلبات الإجازة المعلقة',
      value: '8',
      change: '-3',
      changeType: 'decrease' as const,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Monthly Payroll',
      titleAr: 'رواتب الشهر',
      value: '$125,430',
      change: '+5.2%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      employee: 'Sarah Johnson',
      action: 'submitted leave request',
      actionAr: 'قدم طلب إجازة',
      time: '2 hours ago',
      timeAr: 'منذ ساعتين',
      type: 'leave',
    },
    {
      id: 2,
      employee: 'Michael Chen',
      action: 'joined the team',
      actionAr: 'انضم إلى الفريق',
      time: '1 day ago',
      timeAr: 'منذ يوم',
      type: 'employee',
    },
    {
      id: 3,
      employee: 'Emily Davis',
      action: 'promoted to Senior Developer',
      actionAr: 'تم ترقيته إلى مطور أول',
      time: '3 days ago',
      timeAr: 'منذ 3 أيام',
      type: 'promotion',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Team Meeting',
      titleAr: 'اجتماع الفريق',
      date: 'Today, 2:00 PM',
      dateAr: 'اليوم، 2:00 م',
      type: 'meeting',
    },
    {
      id: 2,
      title: 'Payroll Deadline',
      titleAr: 'موعد رواتب',
      date: 'Tomorrow',
      dateAr: 'غداً',
      type: 'deadline',
    },
    {
      id: 3,
      title: 'Annual Review',
      titleAr: 'المراجعة السنوية',
      date: 'Dec 15, 2024',
      dateAr: '١٥ ديسمبر ٢٠٢٤',
      type: 'review',
    },
  ];

  const isRTL = typeof window !== 'undefined' && document.documentElement.dir === 'rtl';

  const getLocalizedValue = (obj: any, key: string) => {
    return isRTL ? obj[`${key}Ar`] || obj[key] : obj[key];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email}`} />
              <AvatarFallback>
                {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {isRTL ? 'مرحباً' : 'Welcome'}, {session?.user?.firstName}!
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'إليك نظرة عامة على لوحة القيادة الخاصة بك' : 'Here\'s an overview of your dashboard'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="outline">
              {isRTL ? 'تصدير التقرير' : 'Export Report'}
            </Button>
            <Button>
              {isRTL ? 'إضافة موظف' : 'Add Employee'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getLocalizedValue(stat, 'title')}
                  </CardTitle>
                  <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                    <Icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                      {stat.change}
                    </span>
                    <span>{isRTL ? 'من الشهر الماضي' : 'from last month'}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>{isRTL ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
              <CardDescription>
                {isRTL ? 'آخر التحديثات من فريقك' : 'Latest updates from your team'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 rtl:space-x-reverse">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.employee}`} />
                      <AvatarFallback>{activity.employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.employee}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getLocalizedValue(activity, 'action')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getLocalizedValue(activity, 'time')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {activity.type === 'leave' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                      {activity.type === 'employee' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.type === 'promotion' && <TrendingUp className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'الأحداث القادمة' : 'Upcoming Events'}</CardTitle>
              <CardDescription>
                {isRTL ? 'ما يجب مراقبته' : 'What to watch for'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      event.type === 'meeting' ? 'bg-blue-500' :
                      event.type === 'deadline' ? 'bg-red-500' : 'bg-green-500'
                    )} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {getLocalizedValue(event, 'title')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getLocalizedValue(event, 'date')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'إجراءات سريعة' : 'Quick Actions'}</CardTitle>
            <CardDescription>
              {isRTL ? 'إجراءات شائعة يمكنك القيام بها' : 'Common actions you can perform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Users className="mr-2 h-4 w-4" />
                {isRTL ? 'إضافة موظف' : 'Add Employee'}
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {isRTL ? 'طلب إجازة' : 'Request Leave'}
              </Button>
              <Button variant="outline" className="justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                {isRTL ? 'معالجة الرواتب' : 'Process Payroll'}
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                {isRTL ? 'توليد تقرير' : 'Generate Report'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}



