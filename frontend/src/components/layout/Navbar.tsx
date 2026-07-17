"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit } from "lucide-react";

export function Navbar() {
  return (
    <div className="fixed top-[30px] left-0 w-full z-50 flex justify-center px-4">
      <nav 
        className="flex items-center justify-between px-6 py-3 rounded-[16px] backdrop-blur-[50px] shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25)] border border-[rgba(0,0,0,0.1)] w-full max-w-[800px]"
        style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
      >
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight font-fustat text-black dark:text-white">Smart Viva</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-black/70 dark:text-white/70 font-sans">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <Link href="#features" className="hover:text-black dark:hover:text-white transition-colors">Features</Link>
          <Link href="#company" className="hover:text-black dark:hover:text-white transition-colors">Company</Link>
          <Link href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-[12px] bg-white/40 dark:bg-black/40 backdrop-blur-md shadow-[inset_0px_2px_4px_0px_rgba(255,255,255,0.5)] border border-white/20 hover:bg-white/50 dark:hover:bg-black/50 transition-all group font-sans text-sm font-semibold text-black dark:text-white"
          >
            <span>Sign Up</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
