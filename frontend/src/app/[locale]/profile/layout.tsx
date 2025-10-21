import React from "react";
import HeaderBox from "./HeaderBox";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col">
      <HeaderBox />
      <div className="md:pt-[150px] pt-[120px] md:pb-[100px] pb-[50px]">
        {children}
      </div>
    </div>
  );
}
