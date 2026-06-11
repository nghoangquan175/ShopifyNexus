import Link from "next/link";
import Image from "next/image";
import heroBanner from "@/assets/hero-banner.png";

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Majestic snow-capped mountain peaks illuminated by sunrise"
          src={heroBanner}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-white">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-inverse-primary mb-4 opacity-90">
            Embrace the Altitude
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Gear for the Great Beyond
          </h1>
          <p className="text-lg md:text-xl text-inverse-on-surface/90 mb-10 max-w-xl leading-relaxed">
            Premium equipment engineered for the harshest environments, designed with uncompromising elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/collections"
              className="bg-secondary hover:bg-secondary-container text-white px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 shadow-[0_8px_24px_rgba(162,63,0,0.25)] flex items-center justify-center gap-2 group"
            >
              Shop New Arrivals
              <svg
                className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/collections/expeditions"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center"
            >
              Explore Expeditions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
