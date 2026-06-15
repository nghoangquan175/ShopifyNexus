import Image from "next/image";

export default function Sustainability() {
  return (
    <section className="py-24 relative overflow-hidden bg-surface-container-low">
      {/* Background decoration topo SVG */}
      <div className="absolute right-0 top-0 w-full h-full opacity-30 pointer-events-none">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="topo"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 50 Q 25 25, 50 50 T 100 50"
                fill="none"
                stroke="#8192a7"
                strokeWidth="0.5"
              />
              <path
                d="M0 70 Q 25 45, 50 70 T 100 70"
                fill="none"
                stroke="#8192a7"
                strokeWidth="0.5"
              />
              <path
                d="M0 90 Q 25 65, 50 90 T 100 90"
                fill="none"
                stroke="#8192a7"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Left Column: Forest image and floating card */}
        <div className="w-full lg:w-5/12 relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg relative z-10">
            <Image
              alt="Serene view of forest with sunlight streaming through the canopy"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcYy2c62yJRfaS4FzE5c0mumP7xammJ4Q9xLiuEebkB3TGBQzBhSZ3F-JuCk6CYQey6xWTt3bpS_Ji-2bKCO-cq5IgGhQlA7AyRRdA4ZppJA7HDpAprE75qqCvZ6GXatSnAapvgvg5QNnIuccCYL3Zv7IfWZ_0ht89P25jqCT8CZoG4B3iJLBxA2tqOsWTFu1eub5dy-F9G8W9TRrHdO_6_aMfBW0eieuL7PET1v5-xgXNco9lxDkzLKE1WTjeROmqXgfT3p4LwQFh"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Right Column: Copywriting and bullets */}
        <div className="w-full lg:w-7/12 lg:pl-12 mt-16 lg:mt-0">
          <span className="text-xs font-bold text-on-primary-container uppercase tracking-widest block mb-4">
            Our Commitment
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
            Preserving the wild places we love to explore.
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant mb-8 max-w-xl leading-relaxed">
            We believe that true adventure shouldn't come at the cost of the
            environment. From utilizing recycled maritime plastics in our
            outerwear to funding trail restoration projects, sustainability is
            woven into the very fabric of our gear.
          </p>
          <ul className="space-y-6 mb-10 max-w-md">
            <li className="flex items-start gap-4">
              <svg
                className="h-6 w-6 text-primary-container shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <strong className="block text-primary font-bold text-sm md:text-base">
                  Recycled Materials
                </strong>
                <span className="text-on-surface-variant text-sm block mt-0.5">
                  Using post-consumer waste for technical fabrics.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <svg
                className="h-6 w-6 text-primary-container shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <strong className="block text-primary font-bold text-sm md:text-base">
                  Lifetime Repair Guarantee
                </strong>
                <span className="text-on-surface-variant text-sm block mt-0.5">
                  We repair, not replace, to minimize landfill impact.
                </span>
              </div>
            </li>
          </ul>
          <button className="border-2 border-primary-container text-primary-container hover:bg-primary-container hover:text-white px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300">
            Read Our Sustainability Report
          </button>
        </div>
      </div>
    </section>
  );
}
