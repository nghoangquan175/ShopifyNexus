import Link from "next/link";
import Image from "next/image";

type CollectionProp = {
  title: string;
  handle: string;
  image: string;
  tag?: string;
  description?: string;
  linkText: string;
};

export default function FeaturedCollections() {
  const collections: CollectionProp[] = [
    {
      title: "Expedition Series",
      handle: "expeditions",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG5q5l8yK8wGbitnQP8ebmgZo-NMpF9zZM_ZVzoTL0hN7KH1lcWLoziENIawTvlsmNt1fXwd88kjUGgNeKHWYs2BHKaMR4s8FXZZ1zsLirfuxHiGXGW5B24Mc_ct3kPCjyIbOTJC-Ktndei75mp-pQDNE_0lThcwwZ89rKzD9jfJ_oqCEoTPRg7hY5VwH8aaLWhtb93CydmGBXo5TUgN5aRegmuHX01bWWjRZ7M2dp16sf9D8LNY71bPXEIaRSTHJbL7dYRTWjzR7G",
      tag: "Featured Category",
      description: "Our pinnacle collection, tested on the world's highest peaks. Unyielding protection.",
      linkText: "Explore"
    },
    {
      title: "Technical Footwear",
      handle: "gear",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD4sNOuaRUoW0R3qZC3wsSY2unPBLjSPeo_OkhI8Jhox2YTFxLPYLPi8Prt5xdrriHPWzurzt_ITFQaN0riOhCNmd-ka08PE0lTCnFwxWsqM8Fohi-ZFMVeYJuHg0sR1JXNzyaUviHT241rvgZEHurVOfI_y63lJ9Q7Z5pz-9bDXJyc-4wHh4umtTusIGnBYjDaShxSBvOh059w98wr9i7awUJL1hZL1A285xsneU5G3XONd2nlWrWEnJS47zUU5NiGlOU48qbyu2V",
      linkText: "Shop Boots"
    },
    {
      title: "Ultralight Shelter",
      handle: "sustainability",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2045mDgbLeHOwajTswKS3SCPJWaLOh26Na4nzo7U2VJi3RhvRjhYySnG7tDqOZwU_yl3UmEDRBzh-azdPDYT0a79mWy4yeZFRZwWqThyD51EDHLSrRijLgbws_YRG7UdzRfk5HjYcXWd7zcbcgQ5j0GypNh56qr99mKG1p9kREXsDhWX2bc3m5P2uzHYJPDE0ddd5HBaGGk8W8dw42jZS1FDo0pgrte4fdS8Cxnjl8ChRje_OXemRncaIQYyOY0Rfi7koyteQNRFI",
      linkText: "Shop Tents"
    }
  ];

  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary mb-3">
            Curated for the Extreme
          </h2>
          <p className="text-base text-on-surface-variant max-w-lg leading-relaxed">
            Discover our meticulously categorized gear, built to withstand nature's most demanding arenas without sacrificing style.
          </p>
        </div>
        <Link
          href="/collections"
          className="text-secondary font-bold hover:text-secondary-container transition-colors flex items-center gap-1 group text-sm md:text-base"
        >
          View All Collections
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
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
        {/* Large Feature (Col span 7) */}
        <Link
          href={`/collections/${collections[0].handle}`}
          className="md:col-span-7 relative rounded-2xl overflow-hidden group h-[400px] md:h-full cursor-pointer shadow-md hover:shadow-lg transition-all bg-primary block"
        >
          <Image
            alt={collections[0].title}
            src={collections[0].image}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
              {collections[0].tag}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {collections[0].title}
            </h3>
            <p className="text-sm text-white/80 mb-6 max-w-md leading-relaxed">
              {collections[0].description}
            </p>
            <span className="text-white flex items-center gap-2 font-bold group-hover:gap-3 transition-all text-sm">
              Explore
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Small Features (Col span 5) */}
        <div className="md:col-span-5 grid grid-rows-2 gap-6 h-full">
          {/* Top Small Feature */}
          <Link
            href={`/collections/${collections[1].handle}`}
            className="relative rounded-2xl overflow-hidden group h-[280px] md:h-full cursor-pointer shadow-md hover:shadow-lg transition-all bg-primary block"
          >
            <Image
              alt={collections[1].title}
              src={collections[1].image}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-xl font-bold text-white mb-2">
                {collections[1].title}
              </h3>
              <span className="text-white/80 flex items-center gap-2 text-xs font-semibold group-hover:gap-3 transition-all">
                Shop Boots
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Bottom Small Feature */}
          <Link
            href={`/collections/${collections[2].handle}`}
            className="relative rounded-2xl overflow-hidden group h-[280px] md:h-full cursor-pointer shadow-md hover:shadow-lg transition-all bg-primary block"
          >
            <Image
              alt={collections[2].title}
              src={collections[2].image}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-xl font-bold text-white mb-2">
                {collections[2].title}
              </h3>
              <span className="text-white/80 flex items-center gap-2 text-xs font-semibold group-hover:gap-3 transition-all">
                Shop Tents
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
