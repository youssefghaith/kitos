import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const galleryItems = [
  { id: 1, type: "Pool Table", title: "Marble – Black, U‑Frame, Camel Cloth", image: "/gallery/pool-table-1.png" },
  { id: 2, type: "Pool Table", title: "Marble – Light, Wood Rails, Blue Cloth", image: "/gallery/pool-table-2.png" },
  { id: 3, type: "Pool Table", title: "Marble – White Vein, Black Rails, Grey Cloth", image: "/gallery/pool-table-3.png" },
  { id: 4, type: "Pool Table", title: "Marble – Black Streak, Fluted Base, Camel Cloth", image: "/gallery/pool-table-4.png" },
  { id: 5, type: "Pool Table", title: "Hybrid – Wood Rails + Marble Plinth", image: "/gallery/pool-table-5.png" },
  { id: 6, type: "Pool Table", title: "Classic Wood – Turned Legs, Green Cloth", image: "/gallery/pool-table-6.png" },
  { id: 7, type: "Pool Table", title: "Marble – Beige, Geometric Base, Camel Cloth", image: "/gallery/pool-table-7.png" },
  { id: 8, type: "Pool Table", title: "Composite – Striated Grey, U‑Frame, Green Cloth", image: "/gallery/pool-table-8.png" },
  { id: 9, type: "Pool Table", title: "Project 9", image: "/gallery/pool-table-9.png" },
  { id: 10, type: "Pool Table", title: "Project 10", image: "/gallery/pool-table-10.png" },
  { id: 11, type: "Pool Table", title: "Project 11", image: "/gallery/pool-table-11.png" },
  { id: 12, type: "Pool Table", title: "Project 12", image: "/gallery/pool-table-12.png" },
  { id: 13, type: "Pool Table", title: "Project 13", image: "/gallery/pool-table-13.png" },
  { id: 14, type: "Pool Table", title: "Project 14", image: "/gallery/pool-table-14.png" },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of completed projects and get inspired for
            your own custom table
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Yours?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start customizing your perfect table today and join our collection
            of satisfied customers
          </p>
          <Link
            href="/customize"
            className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Start Customizing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
