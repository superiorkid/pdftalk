import type React from "react";
import HomepageHeader from "./_components/homepage-header";

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout = ({ children }: HomepageLayoutProps) => {
  return (
    <div>
      <HomepageHeader />
      <main className="max-w-7xl mx-auto px-5 2xl:px-0">{children}</main>
    </div>
  );
};

export default HomepageLayout;
