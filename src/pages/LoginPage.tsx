import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { LoginFormData } from "../types";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: true },
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError("");
    try {
      await login(data.email, data.password, data.rememberMe);
      navigate("/dashboard");
    } catch (err: unknown) {
      setApiError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center mb-8">
        <div className={`font-bold tracking-wide text-[42px]`}>
          <span className="text-[#38BDF8]">TICKET</span>
          <span className="text-white">TRAXX</span>
        </div>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-[30px] font-semibold text-white">Welcome 👋</h1>
        <p className="text-[#A2A1A8] mt-1 text-base">Please login here</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="relative">
            <label className="input-label">Email Address</label>
            <input
              {...register("email")}
              type="email"
              className="input-dark"
              placeholder=" "
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <label className="input-label">Password</label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="input-dark pr-12"
              placeholder=" "
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-5 h-5 accent-[#1D3461]" />
            <span className="text-base text-[#fff]">Remember Me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-base text-[#fff] hover:text-[#38BDF8] transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center justify-center gap-2 !mt-7"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
