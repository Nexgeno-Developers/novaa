"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Navigation,
  FileText,
  Users,
  BarChart3,
  TrendingUp,
  Activity,
  Globe,
  Shield,
  ArrowUpRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const quickActions = [
  {
    title: "Navigation Management",
    description: "Manage navigation links and site structure",
    href: "/admin/navbar",
    icon: Navigation,
    gradient: "from-blue-500 to-cyan-500",
    stats: "12 items",
  },
  {
    title: "Content Pages",
    description: "Update hero sections and page content",
    href: "/admin/pages",
    icon: FileText,
    gradient: "from-green-500 to-emerald-500",
    stats: "8 pages",
  },
  {
    title: "Analytics Overview",
    description: "View content performance and metrics",
    href: "/admin/analytics",
    icon: BarChart3,
    gradient: "from-purple-500 to-violet-500",
    stats: "24k views",
  },
  {
    title: "User Management",
    description: "Manage admin users and permissions",
    href: "/admin/users",
    icon: Users,
    gradient: "from-orange-500 to-red-500",
    stats: "5 users",
  },
];

const recentActivity = [
  {
    action: "Home page content updated",
    time: "2 minutes ago",
    status: "success",
    icon: CheckCircle,
  },
  {
    action: "New blog post published",
    time: "1 hour ago",
    status: "success",
    icon: CheckCircle,
  },
  {
    action: "Navigation menu restructured",
    time: "3 hours ago",
    status: "info",
    icon: Activity,
  },
  {
    action: "System backup completed",
    time: "6 hours ago",
    status: "success",
    icon: Shield,
  },
];

const systemStatus = [
  { service: "Database", status: "Connected", uptime: "99.9%", color: "green" },
  { service: "CDN", status: "Online", uptime: "100%", color: "green" },
  { service: "Cache", status: "Active", uptime: "98.7%", color: "green" },
  {
    service: "Email Service",
    status: "Warning",
    uptime: "95.2%",
    color: "yellow",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const {user} = useAuth();

  const handleViewAnalytics = () => {
    router.push('/admin/analytics');
  };

  const handleViewAll = () => {
    router.push('/admin/activity');
  };

  const handleViewStatus = () => {
    router.push('/admin/status');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Manage your Novaa Real Estate platform from this premium
                dashboard.
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium"
              >
                <Globe className="h-4 w-4 mr-2" />
                Live Site
              </Badge>
              <Button 
                aria-label="View analytics" 
                className="hover-lift"
                onClick={handleViewAnalytics}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href} aria-label={action.title}>
              <Card className="group hover-lift cursor-pointer border-border/50 hover:border-primary/20 transition-all duration-300 h-full bg-gradient-to-br from-background to-background/50 py-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-3 line-clamp-2">
                    {action.description}
                  </CardDescription>
                  <Badge variant="outline" className="text-xs font-medium">
                    {action.stats}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Stats and Activity Row */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="xl:col-span-2 border-border/50 bg-gradient-to-br from-background to-background/50 py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center">
                <Activity className="h-6 w-6 mr-3 text-primary" />
                Recent Activity
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent/50"
                aria-label="View all activity"
                onClick={handleViewAll}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-accent/30 transition-all duration-200 border border-border/20 hover-lift-sm"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.status === "success"
                          ? "bg-green-100 text-green-600"
                          : activity.status === "info"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-border/50 bg-gradient-to-br from-background to-background/50 py-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Shield className="h-6 w-6 mr-3 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/20 hover:bg-accent/20 transition-colors duration-200"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {service.service}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Uptime: {service.uptime}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        service.color === "green"
                          ? "bg-green-500 animate-pulse"
                          : service.color === "yellow"
                          ? "bg-yellow-500 animate-ping"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        service.color === "green"
                          ? "text-green-600"
                          : service.color === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 hover:bg-accent/50"
              onClick={handleViewStatus}
            >
              View Detailed Status
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
