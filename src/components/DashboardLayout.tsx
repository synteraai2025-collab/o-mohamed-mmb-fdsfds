/**
 * Dashboard Layout Component for HR Management Platform
 * Responsive sidebar navigation with RTL/LTR support
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { hasPermission } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  Gift,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Bell,
  Search,
  Globe,
} from 'lucide-react';

interface NavItem {
  title: string;
  titleAr: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
  badge?: string;
  badgeAr?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRTL, setIsRTL] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items with permissions
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      titleAr: 'لوحة القيادة',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Employees',
      titleAr: 'الموظفون',
      href: '/employees',
      icon: Users,
      permission: 'VIEW_EMPLOYEES',
      badge: 'HR',
      badgeAr: 'موارد بشرية',
    },
    {
      title: 'Departments',
      titleAr: 'الإدارات',
      href: '/departments',
      icon: Building2,
      permission: 'VIEW_DEPARTMENTS',
    },
    {
      title: 'Positions',
      titleAr: 'المناصب',
      href: '/positions',
      icon: Briefcase,
      permission: 'VIEW_POSITIONS',
    },
    {
      title: 'Leave Management',
      titleAr: 'إدارة الإجازات',
      href: '/leave',
      icon: Calendar,
      permission: 'VIEW_LEAVES',
    },
    {
      title: 'Payroll',
      titleAr: 'الرواتب',
      href: '/payroll',
      icon: DollarSign,
      permission: 'VIEW_PAYROLL',
    },
    {
      title: 'Bonuses',
      titleAr: 'المكافآت',
      href: '/bonuses',
      icon: Gift,
      permission: 'VIEW_PAYROLL',
    },
    {
      title: 'Reports',
      titleAr: 'التقارير',
      href: '/reports',
      icon: FileText,
      permission: 'VIEW_REPORTS',
    },
    {
      title: 'Settings',
      titleAr: 'الإعدادات',
      href: '/settings',
      icon: Settings,
      permission: 'VIEW_SETTINGS',
    },
  ];

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return session?.user?.role && hasPermission(session.user.role, item.permission);
  });

  // Handle language direction
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setIsRTL(savedLang === 'ar');
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, []);

  // Handle sidebar collapse state
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const toggleLanguage = () => {
    const newLang = isRTL ? 'en' : 'ar';
    setIsRTL(!isRTL);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const getUserInitials = () => {
    if (!session?.user) return '??';
    const { firstName, lastName } = session.user;
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getLocalizedTitle = (item: NavItem) => {
    return isRTL ? item.titleAr : item.title;
  };

  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo and Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-lg">
              {isRTL ? 'منصة إدارة الموارد البشرية' : 'HR Platform'}
            </span>
          )}
        </div>
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex"
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start relative",
                    sidebarCollapsed && "justify-center px-2",
                    isRTL && "flex-row-reverse"
                  )}
                  asChild
                >
                  <a href={item.href}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left rtl:text-right">
                          {getLocalizedTitle(item)}
                        </span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto rtl:ml-0 rtl:mr-auto">
                            {isRTL ? item.badgeAr : item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </a>
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  {getLocalizedTitle(item)}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email}`} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.firstName} {session?.user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {session?.user?.role?.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          )}
        </div>
        
        {!sidebarCollapsed && (
          <div className="mt-3 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={toggleLanguage}
            >
              <Globe className="h-4 w-4 mr-2" />
              {isRTL ? 'English' : 'العربية'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col border-r bg-card transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent
            side={isRTL ? "right" : "left"}
            className="w-80 p-0"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={isRTL ? 'بحث...' : 'Search...'}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="hidden lg:flex"
              >
                <Globe className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/profile')}
              >
                <UserCircle className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
