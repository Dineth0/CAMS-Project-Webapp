"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Trophy } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { loginUser } from "./Action";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });

      if (response.code === 200) {
        toast.success("Success", "Login Successful!");

        const userData = response.data;

        localStorage.setItem("user", JSON.stringify(userData));

        setTimeout(() => {
          if (userData.role === "ADMIN") {
            router.push("/admin/dashboard");
          } else if (userData.role === "USER" || userData.role === "PLAYER") {
            router.push("/training-program");
          } else {
            router.push("/");
          }
        }, 1500);
        
      } else {
        toast.error("Login Failed", response.message || "Invalid email or password.");
      }
    } catch (error) {
      toast.error("Connection Error", "Cannot connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Image Cover (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Cricket Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full pb-20">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Welcome back to the <br /> <span className="text-emerald-400">Elite Academy</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-md">
            Log in to manage your training programs, track player progress, and build the next generation of champions.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Sign In</h2>
            <p className="text-slate-500 mt-2">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  placeholder="coach@academy.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-600/30 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold cursor-pointer text-emerald-600 hover:text-emerald-500 transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}