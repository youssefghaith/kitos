"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  type: string;
  title: string;
  image_url: string;
};

const fallbackItems: GalleryItem[] = [
  { id: "1", type: "Pool Table", title: "Marble – Black, U‑Frame, Camel Cloth", image_url: "/gallery/pool-table-1.png" },
  { id: "2", type: "Pool Table", title: "Marble – Light, Wood Rails, Blue Cloth", image_url: "/gallery/pool-table-2.png" },
  { id: "3", type: "Pool Table", title: "Marble – White Vein, Black Rails, Grey Cloth", image_url: "/gallery/pool-table-3.png" },
  { id: "4", type: "Pool Table", title: "Marble – Black Streak, Fluted Base, Camel Cloth", image_url: "/gallery/pool-table-4.png" },
  { id: "5", type: "Pool Table", title: "Hybrid – Wood Rails + Marble Plinth", image_url: "/gallery/pool-table-5.png" },
  { id: "6", type: "Pool Table", title: "Classic Wood – Turned Legs, Green Cloth", image_url: "/gallery/pool-table-6.png" },
  { id: "7", type: "Pool Table", title: "Marble – Beige, Geometric Base, Camel Cloth", image_url: "/gallery/pool-table-7.png" },
  { id: "8", type: "Pool Table", title: "Composite – Striated Grey, U‑Frame, Green Cloth", image_url: "/gallery/pool-table-8.png" },
  { id: "9", type: "Pool Table", title: "Project 9", image_url: "/gallery/pool-table-9.png" },
  { id: "10", type: "Pool Table", title: "Project 10", image_url: "/gallery/pool-table-10.png" },
  { id: "11", type: "Pool Table", title: "Project 11", image_url: "/gallery/pool-table-11.png" },
  { id: "12", type: "Pool Table", title: "Project 12", image_url: "/gallery/pool-table-12.png" },
  { id: "13", type: "Pool Table", title: "Project 13", image_url: "/gallery/pool-table-13.png" },
  { id: "14", type: "Pool Table", title: "Project 14", image_url: "/gallery/pool-table-14.png" },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cloudflare/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f3ee] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1a1712] mb-4">
            Our Gallery
          </h1>
          <p className="text-xl text-[#5a5044] max-w-2xl mx-auto">
            Explore curated projects and signature builds.
          </p>
        </div>

        {/* Gallery Grid */}
        {loading && items.length === 0 ? (
          <p className="text-[#5a5044]">Loading gallery...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#e7dccb] shadow-[0_20px_60px_rgba(26,23,18,0.08)] overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-64">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-[#1a1712] px-3 py-1 rounded-full text-sm font-semibold">
                      {item.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#1a1712] mb-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-white rounded-3xl border border-[#e7dccb] shadow-[0_20px_60px_rgba(26,23,18,0.08)] p-8 md:p-12 text-center">
          <h2 className="text-3xl font-semibold text-[#1a1712] mb-4">
            Ready to Create Yours?
          </h2>
          <p className="text-[#5a5044] mb-6 max-w-2xl mx-auto">
            Start customizing your perfect table today and join our collection
            of satisfied customers
          </p>
          <Link
            href="/customize"
            className="inline-flex items-center bg-[#1a1712] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#2b241c] transition-colors"
          >
            Start Customizing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
