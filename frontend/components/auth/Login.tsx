import React from "react";
import { Mail, Lock, LogIn, Shield } from "lucide-react";

interface LoginProps {
  onLogin: (role: "student" | "admin" | "hod") => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = React.useState<"student" | "admin">("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="min-h-screen flex bg-white font-['Poppins']">
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative items-start justify-start overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url(https://futurebanao.com/wp-content/uploads/2025/03/KARE_1.jpg)] bg-cover bg-center opacity-70" />
        <div className="absolute inset-0 bg-slate-900/10" />

        <div className="relative z-20 pt-8 px-12 max-w-lg">
          <h1 className="inline-flex items-baseline gap-4 text-5xl font-black tracking-tight leading-none text-blue-950 bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4">
            <span>Campus</span>
            <span>Connect.</span>
          </h1>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 font-medium">Sign in to your portal</p>
          </div>
          <div className="bg-slate-100 p-1.5 rounded-xl flex mb-8">
            <button
              onClick={() => setRole("student")}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                role === "student"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                role === "admin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Admin
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full p-4 pl-12 bg-slate-50 border rounded-xl"
                  placeholder="name@university.edu"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full p-4 pl-12 bg-slate-50 border rounded-xl"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300"
                />
                <span className="text-sm font-bold text-slate-500">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                Forgot?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <LogIn className="w-5 h-5" />
              Sign in as {role === "admin" ? "Admin" : "Student"}
            </button>

            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={() => onLogin("hod")}
                className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all hover:border-slate-300 active:scale-95 shadow-sm"
              >
                <Shield className="w-4 h-4 text-blue-600" />
                HOD Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
