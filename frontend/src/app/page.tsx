import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#09090B]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Trusted By Section */}
        <section className="py-20 border-t border-[rgba(0,0,0,0.05)] dark:border-white/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-black/40 dark:text-white/40 uppercase tracking-widest mb-10 font-sans">
              Trusted by Top-tier product companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-[60px] md:gap-[100px] opacity-40 grayscale">
              {/* SVG Placeholders for Tech Logos */}
              <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white hover:opacity-100 transition-opacity cursor-pointer">
                <rect width="120" height="40" rx="4" fill="currentColor" opacity="0.2"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="bold">LOGO 1</text>
              </svg>
              <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white hover:opacity-100 transition-opacity cursor-pointer">
                <rect width="120" height="40" rx="4" fill="currentColor" opacity="0.2"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="bold">LOGO 2</text>
              </svg>
              <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white hover:opacity-100 transition-opacity cursor-pointer">
                <rect width="120" height="40" rx="4" fill="currentColor" opacity="0.2"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="bold">LOGO 3</text>
              </svg>
              <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white hover:opacity-100 transition-opacity cursor-pointer">
                <rect width="120" height="40" rx="4" fill="currentColor" opacity="0.2"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="bold">LOGO 4</text>
              </svg>
              <svg width="120" height="40" viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white hover:opacity-100 transition-opacity cursor-pointer">
                <rect width="120" height="40" rx="4" fill="currentColor" opacity="0.2"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="bold">LOGO 5</text>
              </svg>
            </div>
          </div>
        </section>

        {/* Placeholder for Features */}
        <section id="features" className="py-20 bg-black/5 dark:bg-white/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 font-fustat text-black dark:text-white">Everything you need</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: "Smart Extraction", desc: "Upload PDFs or images and let AI extract key topics." },
                { title: "Mock Viva", desc: "Practice with a simulated interactive examiner." },
                { title: "Weakness Tracking", desc: "Identify and conquer your weak areas before the real exam." }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-[24px] bg-white dark:bg-[#18181B] border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all shadow-sm">
                  <h3 className="text-xl font-bold mb-3 font-fustat text-black dark:text-white">{f.title}</h3>
                  <p className="text-black/60 dark:text-white/60 font-sans leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 text-center text-black/50 dark:text-white/50 border-t border-[rgba(0,0,0,0.05)] dark:border-white/5 font-sans">
        <p>© {new Date().getFullYear()} Smart Viva. All rights reserved.</p>
      </footer>
    </div>
  );
}
