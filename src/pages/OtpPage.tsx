import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { useAuth } from "../context/AuthContext";

const OTP_LENGTH = 5;

export const OtpPage = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const { resetPasswordEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!resetPasswordEmail) navigate("/forgot-password");
  }, [resetPasswordEmail, navigate]);

  useEffect(() => {
    const t = setInterval(
      () => setResendTimer((v) => Math.max(0, v - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    setError("");
    if (val && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(""));
      inputs.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter all 6 digits");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    navigate("/reset-password");
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputs.current[0]?.focus();
  };

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
          <h1 className="text-[30px] font-semibold text-white">Enter OTP</h1>
          <p className="text-[#A2A1A8] mt-1 text-base">
            We have share a code of your registered email address{" "}
            <span className="">{resetPasswordEmail}</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 justify-between" onPaste={handlePaste}>
          {otp.map((val, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-14 h-14 text-center text-xl font-bold bg-[#292929] border rounded-lg outline-none transition-colors ${
                val
                  ? "border-[#38BDF8] text-white"
                  : "border-[#343434] text-[#64748B]"
              } focus:border-[#38BDF8]`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Verify"
          )}
        </button>

        {/* <p className="text-center text-sm text-[#64748B]">
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className={`font-medium transition-colors ${
              resendTimer > 0
                ? 'text-[#64748B] cursor-not-allowed'
                : 'text-[#38BDF8] hover:text-[#7DD3FC] cursor-pointer'
            }`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </p> */}
      </div>
    </AuthLayout>
  );
};
