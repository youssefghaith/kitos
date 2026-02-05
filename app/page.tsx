import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#f6f3ee] text-[#1a1712]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff,transparent_60%)]" />
          <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(196,166,112,0.35),transparent_70%)] blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,92,56,0.25),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c4a670]/40 px-4 py-1 text-xs tracking-[0.2em] uppercase text-[#8a6b3f]">
                Egyptian Crafted
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl leading-tight font-semibold">
                Bespoke pool tables, built in Egypt for refined interiors.
              </h1>
              <p className="mt-6 text-lg md:text-2xl text-[#4b4237]">
                Handcrafted by master craftsmen. Marble, wood, and hybrid tables tailored
                to your space, your palette, and your vision.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/marble"
                  className="inline-flex items-center justify-center rounded-full bg-[#1a1712] text-white px-8 py-4 font-semibold hover:bg-[#2b241c] transition-colors"
                >
                  Start a custom build
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center rounded-full border border-[#b59a6a]/60 px-8 py-4 font-semibold text-[#1a1712] hover:border-[#8a6b3f] hover:text-[#8a6b3f] transition-colors"
                >
                  View private gallery
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-full w-full rounded-[32px] border border-[#e6ddcf] bg-white/50" />
              <div className="relative h-[420px] md:h-[520px] rounded-[32px] overflow-hidden border border-[#e6ddcf] shadow-[0_30px_80px_rgba(26,23,18,0.18)]">
                <Image
                  src="/homepage/marble/marble-1.png"
                  alt="KITOS signature marble pool table"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {[
              { title: "Egyptian craft", desc: "Built by Egyptian artisans." },
              { title: "Tailored builds", desc: "Sizes, finishes, and details matched to your space." },
              { title: "Regional delivery", desc: "Delivery and installation across Egypt & Saudi Arabia." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#e7dccb] bg-white/70 px-6 py-5"
              >
                <p className="text-[#8a6b3f] font-semibold">{item.title}</p>
                <p className="mt-2 text-[#5a5044]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Collections */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8a6b3f]">Collections</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
                Collections that anchor the room.
              </h2>
            </div>
            <p className="text-[#5a5044] max-w-xl">
              Choose marble, wood, or hybrid builds. Then refine every detail:
              stone, cloth, pockets, and accents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                href: "/marble",
                title: "Marble",
                desc: "Nero and Calacatta marble with bold veining.",
                image: "/homepage/marble/marble-2.png",
              },
              {
                href: "/wood",
                title: "Wood",
                desc: "Warm walnut, ash, and custom stains.",
                image: "/homepage/wood/wood-1.png",
              },
              {
                href: "/hybrid",
                title: "Hybrid",
                desc: "Stone surfaces paired with tailored wood bases.",
                image: "/homepage/hybrid/hybrid-1.png",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative h-[420px] rounded-3xl overflow-hidden border border-[#e7dccb] bg-white"
              >
                <Image
                  src={card.image}
                  alt={`${card.title} pool table collection`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14110d]/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#e7dccb]">
                    Collection
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-[#f3eee6]">{card.desc}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#f7e5bf]">
                    View collection <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Process */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8a6b3f]">Bespoke process</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
                From concept to installation, handled in-house.
              </h2>
              <p className="mt-6 text-[#5a5044]">
                We work with homeowners, designers, and hospitality teams. Every
                proportion and finish is approved with you before production.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "01. Space & intent",
                  desc: "We align size, layout, and the room’s palette.",
                },
                {
                  title: "02. Materials",
                  desc: "Choose stone, wood, cloth, and pocket details.",
                },
                {
                  title: "03. Build & install",
                  desc: "Made in Egypt, inspected, and installed worldwide.",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-[#efe6d7] bg-[#fbf9f4] px-6 py-5"
                >
                  <p className="text-[#8a6b3f] font-semibold">{step.title}</p>
                  <p className="mt-2 text-[#5a5044]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Material Library */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr,1.2fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8a6b3f]">Materials</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
                Marble, wood, and cloth curated for lasting elegance.
              </h2>
              <p className="mt-6 text-[#5a5044]">
                We source striking marble slabs, premium woods, and professional
                cloth in rich tones. Every finish is selected to match your interior.
              </p>
            </div>
            <div className="rounded-3xl border border-[#e7dccb] bg-white p-8 shadow-[0_20px_60px_rgba(26,23,18,0.08)]">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Nero Marquina", swatch: "#0f0f10" },
                  { label: "Calacatta", swatch: "#f1eee7" },
                  { label: "Walnut", swatch: "#6f4a2f" },
                  { label: "Ebony", swatch: "#151311" },
                  { label: "Charcoal Cloth", swatch: "#2c2c2c" },
                  { label: "Cobalt Cloth", swatch: "#1b3f8c" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span
                      className="h-8 w-8 rounded-full border border-[#e6ddcf]"
                      style={{ backgroundColor: item.swatch }}
                    />
                    <span className="text-[#4b4237]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atelier Proof */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr] items-center">
            <div className="relative h-80 md:h-[420px] rounded-3xl overflow-hidden border border-[#e7dccb]">
              <Image
                src="/homepage/marble/marble-3.png"
                alt="KITOS table installed in a luxury interior"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8a6b3f]">Atelier</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
                Egyptian craftsmanship, engineered for precision play.
              </h2>
              <p className="mt-6 text-[#5a5044]">
                Every table is aligned for professional play, then refined by hand
                for heirloom‑grade finish and durability.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                {[
                  { title: "Build time", desc: "Lead time set per project" },
                  { title: "Fully bespoke", desc: "Every build is custom" },
                  { title: "Pro-grade play", desc: "Precision-leveled surface" },
                  { title: "Client care", desc: "Dedicated after‑delivery support" },
                ].map((stat) => (
                  <div key={stat.title} className="rounded-2xl border border-[#efe6d7] bg-[#fbf9f4] px-4 py-4">
                    <p className="text-[#8a6b3f] font-semibold">{stat.title}</p>
                    <p className="text-[#5a5044]">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8a6b3f]">Private commissioning</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold">
            Commission a table that defines the room.
          </h2>
          <p className="mt-6 text-[#5a5044] max-w-2xl mx-auto">
            We guide you through layout, material selection, and finishing details
            with clear timelines and direct communication.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/marble"
              className="inline-flex items-center justify-center rounded-full bg-[#1a1712] text-white px-8 py-4 font-semibold hover:bg-[#2b241c] transition-colors"
            >
              Begin a custom order
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#b59a6a]/60 px-8 py-4 font-semibold text-[#1a1712] hover:border-[#8a6b3f] hover:text-[#8a6b3f] transition-colors"
            >
              Speak with the atelier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
