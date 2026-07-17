"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 50, damping: 15 } 
    }
  };

  return (
    <section className="relative pt-[120px] pb-20 md:pt-[180px] md:pb-32 overflow-hidden bg-white dark:bg-[#09090B]">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#60B1FF] opacity-20 dark:opacity-10 blur-[120px]" />
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#319AFF] opacity-20 dark:opacity-10 blur-[100px]" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8 max-w-[650px]"
        >
          {/* Social Proof */}
          <motion.div variants={itemVariants} className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#FF801E] text-[#FF801E]" />
              ))}
            </div>
            <span className="text-sm font-semibold text-black/70 dark:text-white/70 font-sans">
              Rated 4.9/5 by 2700+ customers
            </span>
          </motion.div>
          
          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-[50px] md:text-[75px] font-fustat font-bold leading-[1.05] tracking-[-2px] text-black dark:text-white">
            Work smarter, achieve faster
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-[18px] font-sans tracking-[-1px] text-black/70 dark:text-white/70 leading-relaxed">
            Upload your study materials and let AI generate personalized viva questions, mock interviews, and instant feedback to help you ace your exams.
          </motion.p>
          
          {/* Primary CTA */}
          <motion.div variants={itemVariants} className="pt-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-[16px] text-white font-sans font-semibold text-lg transition-transform duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: 'rgba(0,132,255,0.8)',
                backdropFilter: 'blur(2px)',
                boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
              }}
            >
              <span>Get Started Now</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-[rgba(0,132,255,1)]" />
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column (Smart Study Illustration) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.2 },
            scale: { duration: 0.8, delay: 0.2 },
            y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }
          }}
          className="relative w-full flex items-center justify-center pointer-events-none"
        >
          {/* Decorative subtle glow behind the illustration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#60B1FF_0%,_transparent_60%)] rounded-full blur-[80px] opacity-20" />
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/illustration.png" 
            alt="Smart AI Study Illustration" 
            className="relative z-10 w-full max-w-[600px] h-auto object-contain transition-transform hover:scale-[1.02] duration-500 mix-blend-multiply"
            style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 75%)' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
