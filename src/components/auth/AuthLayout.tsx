import { ReactNode } from "react";
import LoginBg from "../../assets/images/login-bg.png";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div
      className="h-screen auth-bg flex items-center justify-center p-4 relative bg-repeat w-full overflow-hidden"
      style={{ backgroundImage: `url(${LoginBg})` }}
    >
      <div
        className="w-[700px] h-[700px] absolute top-[-270px] left-[-270px] bg-[#1D3461] rounded-full z-10"
        style={{ filter: "blur(500px)" }}
      />
      <div
        className="w-[700px] h-[700px] absolute bottom-[-270px] right-[-270px] bg-[#1D3461] rounded-full z-10"
        style={{ filter: "blur(500px)" }}
      />
      <div className="w-full max-w-[561px] z-10">
        <div className="bg-[#222222] border border-[#1C3B73] rounded-xl lg:p-12 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
