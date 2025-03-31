
import React from "react";
import { cn } from "@/lib/utils";

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

const Navbar = ({ className, ...props }: NavbarProps) => {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md z-50 border-b flex items-center px-6 animate-fade-in",
        className
      )}
      {...props}
    >
      <nav className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-medium tracking-tight">PixelPost</h1>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
