import type React from "react";
import AuthNav from "./_components/auth-nav";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex justify-center items-center relative">
      <AuthNav />
      <main className="w-[476px]">{children}</main>
    </div>
  );
};

export default AuthLayout;
