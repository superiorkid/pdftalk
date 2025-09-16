import type React from "react";

interface PdfChatLayoutProps {
  children: React.ReactNode;
}

const PdfChatLayout = ({ children }: PdfChatLayoutProps) => {
  return <div>{children}</div>;
};

export default PdfChatLayout;
