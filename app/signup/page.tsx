"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { registerUser } from "./Action";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const validateField = (name: string, value: string) => {
    let errorMsg = "";

    if (!value.trim()) {
      return "This field is required"; 
    }

    switch (name) {
      case "userName":
        const userRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!userRegex.test(value)) {
          errorMsg = "Username must be 3-20 characters long (No spaces or special chars).";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMsg = "Please enter a valid email address.";
        }
        break;
      case "password":
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passRegex.test(value)) {
          errorMsg = "Password must be at least 8 characters, include a letter and a number.";
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
    
    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      userName: validateField("userName", formData.userName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    if (newErrors.userName || newErrors.email || newErrors.password) {
      toast.error("Validation Error", "Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser(formData);

      if (response.code === 201) {
        toast.success("Success", "Registered Successfully");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else if (response.code === 409) {
        toast.error("Error", "User already exists with this email.");
      } else {
        toast.error("Error", response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Connection Error", "Cannot connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Right Side - Image Cover */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden order-2">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30" />
        
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white h-full w-full">
           <ShieldCheck className="w-16 h-16 text-emerald-400 mb-6" />
           <h2 className="text-3xl font-bold mb-4">Join the Academy</h2>
           <p className="text-slate-300 max-w-sm">
             Create your account to manage enrollments, schedule training programs, and monitor player statistics.
           </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 order-1">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2">Get started with your academy management</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            
            {/* UserName Field */}
            <div className="space-y-1 w-full">
                <label className="text-sm font-medium text-slate-700">User Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`h-4 w-4 ${errors.userName ? 'text-red-400' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.userName 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-200 focus:ring-emerald-500 bg-slate-50 focus:bg-white'
                    }`}
                    placeholder="Osanka"
                  />
                </div>
                {/* Validation Error Message පෙන්වීම */}
                {errors.userName && <p className="text-xs text-red-500 mt-1">{errors.userName}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-4 w-4 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-slate-200 focus:ring-emerald-500 bg-slate-50 focus:bg-white'
                  }`}
                  placeholder="player29@gmail.com"
                />
              </div>
              {/* Validation Error Message පෙන්වීම */}
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-4 w-4 ${errors.password ? 'text-red-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-slate-200 focus:ring-emerald-500 bg-slate-50 focus:bg-white'
                  }`}
                  placeholder="Create a strong password"
                />
              </div>
              {/* Validation Error Message පෙන්වීම */}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center cursor-pointer justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold cursor-pointer text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}