import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { ResetPasswordFormData } from "../types";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-[#2A3A4A]",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : "bg-[#2A3A4A]"}`}
          />
        ))}
      </div>
      {password && (
        <p
          className={`text-xs ${score <= 1 ? "text-red-400" : score <= 2 ? "text-orange-400" : score <= 3 ? "text-yellow-400" : "text-green-400"}`}
        >
          {labels[score]} password
        </p>
      )}
    </div>
  );
};

export const ResetPasswordPage = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const { setResetPasswordEmail } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password", "");
  const onSubmit = async (_data: ResetPasswordFormData) => {
    await new Promise(r => setTimeout(r, 1000));
    setSuccess(true);
    setResetPasswordEmail(null);
  };
 
  if (success) {
    return (
      <AuthLayout>
        <div className="text-center py-6">
          <div className="text-[100px] mb-6">🎉</div>
          <h2 className="text-[30px] font-semibold text-white mb-3">
            Password Updated<br />Successfully
          </h2>
          <p className="text-[#A2A1A8] text-base mb-8">
            Your password has been update successfully
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Back to Login
          </button>
        </div>
      </AuthLayout>
    );
  }


  return (
    <AuthLayout>
      <div className="mb-8">
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-base text-[#fff] transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Back
        </Link>
        <div className="mb-2">
          <h1 className="text-[30px] font-semibold text-white">
            Reset Password
          </h1>
          <p className="text-[#A2A1A8] mt-1 text-base">
            Create a new secure password for your account
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="relative">
            <label className="input-label">New Password</label>
            <input
              {...register("password")}
              type={showPwd ? "text" : "password"}
              className="input-dark pr-12"
              placeholder=" "
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <PasswordStrength password={password} />
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <label className="input-label">Confirm New Password</label>
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              className="input-dark pr-12"
              placeholder=" "
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};
