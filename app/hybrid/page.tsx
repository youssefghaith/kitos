"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type MarbleDesign } from "@/lib/marbleDesigns";
import { getCategory, getDesignsByCategory, type CategoryRecord } from "@/lib/designsData";

export default function HybridDesignsPage() {
  const [designs, setDesigns] = useState<MarbleDesign[]>([]);
  const [category, setCategory] = useState<CategoryRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDesignsByCategory("hybrid"), getCategory("hybrid")])
      .then(([designData, categoryData]) => {
        setDesigns(designData);
        setCategory(categoryData);
      })
      .catch((err) => {
        console.error("Failed to fetch designs:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f3ee] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-[#e7dccb] bg-white mb-10">
          {category?.hero_image_url && (
            <div className="absolute inset-0">
              <Image
                src={category.hero_image_url}
                alt={`${category.name} hero`}
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/30" />
            </div>
          )}
          <div className="relative px-6 py-10 md:px-10 md:py-14 flex items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8a6b3f] mb-3">
                Hybrid Collection
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1712] mb-2">
                {category?.name ?? "Hybrid"} Pool Tables
              </h1>
              <p className="text-[#5a5044] max-w-2xl">
                {category?.description ||
                  "Explore hybrid designs that blend marble and warm wood accents."}
              </p>
            </div>
            <Link
              href="/"
              className="hidden sm:inline-flex text-sm text-[#5a5044] hover:text-[#1a1712] underline-offset-4 hover:underline"
            >
              ← Back to home
            </Link>
          </div>
        </div>

        {loading && designs.length === 0 ? (
          <p className="text-[#5a5044]">Loading designs...</p>
        ) : designs.length === 0 ? (
          <div className="rounded-3xl border border-[#e7dccb] bg-white px-8 py-10 text-center">
            <p className="text-[#5a5044]">No hybrid designs yet.</p>
            <p className="text-sm text-[#8a6b3f] mt-2">Add a design in the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {designs.map((design) => (
              <div
                key={design.slug}
                className="group bg-white rounded-3xl overflow-hidden border border-[#e7dccb] shadow-[0_20px_60px_rgba(26,23,18,0.08)] flex flex-col"
              >
                <div className="relative h-64">
                  <Image
                    src={design.heroImage}
                    alt={design.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold text-[#1a1712] mb-2">
                    {design.name}
                  </h2>
                  <p className="text-sm text-[#5a5044] mb-4 flex-1">
                    {design.description}
                  </p>
                  <Link
                    href={`/detail/marble-table-1?design=${design.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#1a1712] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#2b241c]"
                  >
                    Customize this design
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
