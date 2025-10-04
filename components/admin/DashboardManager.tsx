"use client";

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
    href: "#",
    icon: BarChart3,
    gradient: "from-purple-500 to-violet-500",
    stats: "24k views",
  },
  {
    title: "User Management",
    description: "Manage admin users and permissions",
    href: "#",
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
  const { user } = useAuth();

  const handleViewAnalytics = () => {
    router.push("#");
  };

  const handleViewAll = () => {
    router.push("#");
  };

  const handleViewStatus = () => {
    router.push("#");
  };

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 -m-6">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/8 to-blue-500/10 rounded-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="relative px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              {/* User Avatar and Greeting */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white font-bold text-2xl">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "N"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                      Welcome back!
                    </h1>
                    <div className="w-8 h-8 text-2xl">👋</div>
                  </div>
                  <p className="text-lg text-slate-600 font-medium">
                    Ready to manage Novaa Global Properties
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-600 font-medium">
                        System Online
                      </span>
                    </div>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm">
                      Premium Edition
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="group bg-white/80 backdrop-blur-xl border-slate-200/60 hover:bg-white hover:shadow-lg transition-all duration-300"
                onClick={() =>
                  window.open("https://novaa-pi.vercell.app/", "_blank")
                }
              >
                <Globe className="h-4 w-4 mr-2 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                <span className="font-medium">Live Site</span>
                <ArrowUpRight className="h-4 w-4 ml-2 text-slate-400" />
              </Button>
              <Button
                className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
                onClick={handleViewAnalytics}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="font-medium">Analytics</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <div className="text-sm text-slate-500 font-medium">
            Manage your content
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                aria-label={action.title}
              >
                <Card className="group cursor-pointer bg-white/80 backdrop-blur-xl border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardHeader className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                      <div
                        className={`w-full h-full bg-gradient-to-br ${action.gradient} rounded-full blur-2xl`}
                      />
                    </div>
                    <div className="relative flex items-center justify-between mb-4">
                      <div
                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-300 group-hover:translate-x-1" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-emerald-600 transition-colors duration-300 mb-2">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                        {action.stats}
                      </Badge>
                      <div className="text-xs text-slate-500 font-medium">
                        Click to manage
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Modern Activity & Status */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              Recent Activity
            </h2>
            <div className="text-sm text-slate-500 font-medium">
              System updates
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              System Status
            </h2>
            <div className="text-sm text-slate-500 font-medium">
              Health check
            </div>
          </div>
        </div>

        <div className="xl:col-span-full grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Modern Recent Activity */}
          <Card className="xl:col-span-2 bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      Recent Activity
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                      Latest system updates
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-slate-100 rounded-xl px-4"
                  aria-label="View all activity"
                  onClick={handleViewAll}
                >
                  View All →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50/60 hover:bg-slate-100/80 transition-all duration-200 border border-slate-200/40 hover:border-emerald-200/60 hover:shadow-sm group cursor-pointer"
                    >
                      <div
                        className={`p-3 rounded-xl shadow-sm ${
                          activity.status === "success"
                            ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                            : activity.status === "info"
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                            : "bg-gradient-to-br from-yellow-500 to-orange-500 text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                          {activity.action}
                        </p>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Clock className="h-3 w-3 mr-2" />
                          {activity.time}
                        </div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : activity.status === "info"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        } animate-pulse`}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Modern System Status */}
          <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">
                      System Status
                    </CardTitle>
                    <p className="text-sm text-slate-500">Health monitoring</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-slate-100 rounded-xl px-4"
                  onClick={handleViewStatus}
                >
                  Details →
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50/60 hover:bg-slate-100/80 transition-all duration-200 border border-slate-200/40 group cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800 mb-1">
                        {service.service}
                      </div>
                      <div className="text-xs text-slate-500">
                        Uptime: {service.uptime}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-3 w-3 rounded-full shadow-sm ${
                          service.color === "green"
                            ? "bg-green-500"
                            : service.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        } animate-pulse`}
                      />
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-lg ${
                          service.color === "green"
                            ? "bg-green-100 text-green-700"
                            : service.color === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
