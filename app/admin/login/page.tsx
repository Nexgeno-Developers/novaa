// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { login, clearError, verifyAuth } from "@/redux/slices/authSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { Shield, Eye, EyeOff, Sparkles, Lock, Mail } from "lucide-react";

// export default function AdminLogin() {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { loading, error, isAuthenticated } = useAppSelector(
//     (state) => state.auth
//   );

//   useEffect(() => {
//     // Check if already authenticated
//     dispatch(verifyAuth());
//   }, [dispatch]);

//   useEffect(() => {
//     if (isAuthenticated) {
//       router.replace("/admin/dashboard");
//     }
//   }, [isAuthenticated, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     dispatch(clearError());
//     setIsLoading(true);

//     try {
//       await dispatch(login(credentials)).unwrap();
//       router.push("/admin/dashboard");
//     } catch (error) {
//       // Error handled by Redux
//       console.error("Failed to fetch project data:", error);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   if (isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-border"></div>
//           <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
//           <div className="absolute inset-3 animate-pulse bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen admin-theme flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
//       style={{
//         backgroundImage: `
//           radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
//           radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
//           linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0f0f23 100%)
//         `,
//         backgroundSize: "100% 100%, 100% 100%, 100% 100%",
//         backgroundAttachment: "fixed",
//       }}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>
//       </div>

//       {/* Glassmorphism grid pattern */}
//       <div
//         className="absolute inset-0 opacity-[0.02]"
//         style={{
//           backgroundImage: `
//             linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
//           `,
//           backgroundSize: "50px 50px",
//         }}
//       ></div>

//       <Card className="w-full max-w-md relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/50 overflow-hidden">
//         {/* Card glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-xl opacity-50"></div>

//         {/* Inner border glow */}
//         <div className="absolute inset-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-[inherit] pointer-events-none"></div>

//         <CardHeader className="text-center relative z-10 pb-8 pt-10">
//           <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
//             <Shield className="w-8 h-8 text-white" />
//           </div>

//           <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
//             Admin Portal
//           </CardTitle>
//           <CardDescription className="text-slate-300 text-base">
//             Secure access to{" "}
//             <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">
//               Novaa CMS
//             </span>{" "}
//             dashboard
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="relative z-10 px-8 pb-10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {error && (
//               <Alert
//                 variant="destructive"
//                 className="bg-red-500/10 border-red-500/30 backdrop-blur-sm"
//               >
//                 <AlertDescription className="text-red-200">
//                   {error}
//                 </AlertDescription>
//               </Alert>
//             )}

//             <div className="space-y-4">
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
//                 </div>
//                 <Input
//                   name="email"
//                   type="email"
//                   placeholder="Email address"
//                   value={credentials.email}
//                   onChange={handleChange}
//                   required
//                   className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 backdrop-blur-sm"
//                 />
//                 <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-focus-within:from-blue-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-blue-500/10 transition-all duration-200 pointer-events-none"></div>
//               </div>

//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
//                 </div>
//                 <Input
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={credentials.password}
//                   onChange={handleChange}
//                   required
//                   className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 backdrop-blur-sm"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
//                   )}
//                 </button>
//                 <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-focus-within:from-blue-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-blue-500/10 transition-all duration-200 pointer-events-none"></div>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               disabled={loading || isLoading}
//               className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
//             >
//               {/* Button glow effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>

//               <div className="relative flex items-center justify-center gap-2">
//                 {loading || isLoading ? (
//                   <>
//                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                     <span>Signing in...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="w-5 h-5" />
//                     <span>Access Dashboard</span>
//                   </>
//                 )}
//               </div>
//             </Button>
//           </form>

//           {/* Decorative elements */}
//           <div className="mt-8 pt-6 border-t border-white/10">
//             <p className="text-center text-xs text-slate-400">
//               Protected by enterprise-grade security
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login, clearError } from '@/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{email?: string; password?: string}>({});

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const validateForm = () => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(login({ email: email.trim(), password })).unwrap();
      toast.success('Login successful! Redirecting...');
      router.replace('/admin/dashboard');
    } catch (error: any) {
      toast.error(error || 'Login failed');
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
      if (formErrors.email) {
        setFormErrors(prev => ({ ...prev, email: undefined }));
      }
    } else {
      setPassword(value);
      if (formErrors.password) {
        setFormErrors(prev => ({ ...prev, password: undefined }));
      }
    }
    
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-indigo-400/20"></div>
      
      <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative py-6 admin-theme">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-slate-800">
              Admin Login
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sign in to access the Novaa Admin Dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 h-12 bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                    formErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={loading}
                />
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 pr-12 h-12 bg-white/70 border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                    formErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Protected by enterprise security • Novaa Global Properties
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}