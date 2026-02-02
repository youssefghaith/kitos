"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import MarbleTableVisual from "@/components/MarbleTableVisual";

const sizes = [
  { value: "small", label: "Small (4-6 seats)", price: 3000 },
  { value: "medium", label: "Medium (6-8 seats)", price: 4500 },
  { value: "large", label: "Large (8-10 seats)", price: 6000 },
];

const marbleTypes = [
  { value: "carrara", label: "Carrara White", price: 0, description: "Classic white with gray veining" },
  { value: "calacatta", label: "Calacatta Gold", price: 800, description: "White with gold veining" },
  { value: "nero", label: "Nero Marquina", price: 600, description: "Deep black marble" },
  { value: "emperador", label: "Emperador Brown", price: 500, description: "Rich brown tones" },
  { value: "verde", label: "Verde Guatemala", price: 700, description: "Green marble" },
];

const legStyles = [
  { value: "pedestal", label: "Pedestal", price: 0, description: "Single central base" },
  { value: "four-leg", label: "Four Leg", price: 300, description: "Classic four corners" },
  { value: "geometric", label: "Geometric", price: 500, description: "Modern angular design" },
];

const finishes = [
  { value: "polished", label: "Polished", price: 0 },
  { value: "honed", label: "Honed", price: 200 },
  { value: "leathered", label: "Leathered", price: 300 },
];

const accessories = [
  { value: "chairSet", label: "Matching Chair Set (6)", price: 2000 },
  { value: "tablePad", label: "Custom Table Pad", price: 300 },
  { value: "sealer", label: "Premium Marble Sealer", price: 150 },
  { value: "lighting", label: "Chandelier Lighting", price: 800 },
];

export default function MarbleTableCustomizer() {
  const [size, setSize] = useState("medium");
  const [marbleType, setMarbleType] = useState("carrara");
  const [legStyle, setLegStyle] = useState("pedestal");
  const [finish, setFinish] = useState("polished");
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const calculatePrice = () => {
    const sizePrice = sizes.find((s) => s.value === size)?.price || 0;
    const marblePrice = marbleTypes.find((m) => m.value === marbleType)?.price || 0;
    const legPrice = legStyles.find((l) => l.value === legStyle)?.price || 0;
    const finishPrice = finishes.find((f) => f.value === finish)?.price || 0;
    const accessoriesPrice = selectedAccessories.reduce((total, acc) => {
      const accessory = accessories.find((a) => a.value === acc);
      return total + (accessory?.price || 0);
    }, 0);

    return sizePrice + marblePrice + legPrice + finishPrice + accessoriesPrice;
  };

  const toggleAccessory = (value: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const getWhatsAppMessage = () => {
    const price = calculatePrice();
    const accessoriesList = selectedAccessories
      .map((acc) => accessories.find((a) => a.value === acc)?.label)
      .join(", ");

    return encodeURIComponent(
      `Hi! I'd like to request a quote for a custom marble table:\n\n` +
        `Size: ${sizes.find((s) => s.value === size)?.label}\n` +
        `Marble Type: ${marbleTypes.find((m) => m.value === marbleType)?.label}\n` +
        `Leg Style: ${legStyles.find((l) => l.value === legStyle)?.label}\n` +
        `Finish: ${finishes.find((f) => f.value === finish)?.label}\n` +
        `Accessories: ${accessoriesList || "None"}\n\n` +
        `Estimated Price: $${price.toLocaleString()}\n\n` +
        `Please provide more details about pricing and delivery.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/customize"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to selection
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Customize Your Marble Table
          </h1>
          <p className="text-gray-600">
            Create an elegant marble table perfect for your dining space
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 lg:sticky lg:top-24 h-fit">
            <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
            <div className="aspect-[4/3]">
              <MarbleTableVisual
                size={size}
                marbleType={marbleType}
                legStyle={legStyle}
              />
            </div>
            
            {/* Price */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">
                  Estimated Price
                </span>
                <span className="text-3xl font-bold text-gray-900">
                  ${calculatePrice().toLocaleString()}
                </span>
              </div>
              <a
                href={`https://wa.me/1234567890?text=${getWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Request Quote via WhatsApp
              </a>
            </div>
          </div>

          {/* Options Section */}
          <div className="space-y-6">
            {/* Size Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Table Size</h3>
              <div className="space-y-3">
                {sizes.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      size === s.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">{s.label}</div>
                      <div className="text-sm text-gray-600">
                        +${s.price.toLocaleString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Marble Type Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Marble Type</h3>
              <div className="space-y-3">
                {marbleTypes.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMarbleType(m.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      marbleType === m.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{m.label}</div>
                        <div className="text-sm text-gray-500">{m.description}</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {m.price === 0 ? "Included" : `+$${m.price}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Leg Style Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Base Style</h3>
              <div className="space-y-3">
                {legStyles.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLegStyle(l.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      legStyle === l.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{l.label}</div>
                        <div className="text-sm text-gray-500">{l.description}</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {l.price === 0 ? "Included" : `+$${l.price}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Finish Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Surface Finish</h3>
              <div className="grid grid-cols-3 gap-3">
                {finishes.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFinish(f.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      finish === f.value
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-sm">{f.label}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {f.price === 0 ? "Included" : `+$${f.price}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Accessories (Optional)
              </h3>
              <div className="space-y-3">
                {accessories.map((a) => (
                  <label
                    key={a.value}
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAccessories.includes(a.value)}
                        onChange={() => toggleAccessory(a.value)}
                        className="mr-3 h-5 w-5"
                      />
                      <span className="font-medium">{a.label}</span>
                    </div>
                    <span className="text-gray-600">+${a.price.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
