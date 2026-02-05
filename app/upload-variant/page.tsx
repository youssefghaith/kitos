"use client";

import { FormEvent, useState } from "react";

export default function UploadVariantPage() {
  const [designSlug, setDesignSlug] = useState("nero-signature");
  const [material, setMaterial] = useState("nero");
  const [cloth, setCloth] = useState("charcoal");
  const [wood, setWood] = useState("black");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ url: string; code: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("designSlug", designSlug);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Try to save variant metadata to D1/database
      try {
        const variantResponse = await fetch("/api/cloudflare/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            design_slug: designSlug,
            material,
            cloth,
            wood_accent: wood,
            image_url: data.url,
          }),
        });

        const variantData = await variantResponse.json();
        
        if (variantData.storage === "d1") {
          // Saved to D1 successfully
          setResult({
            url: data.url,
            code: "✅ Variant saved to Cloudflare D1! No manual code needed.",
          });
          return;
        }
      } catch (apiError) {
        console.error("Failed to save to D1:", apiError);
      }

      // Generate code snippet for manual addition
      const codeSnippet = `{
  material: "${material}",
  cloth: "${cloth}",
  wood: "${wood}",
  image: "${data.url}",
},`;

      setResult({ url: data.url, code: codeSnippet });
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Table Variant</h1>
        <p className="text-gray-600 mb-8">
          Upload a variant image and get the code snippet to add to{" "}
          <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm">lib/marbleDesigns.ts</code>
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Design Slug</label>
              <select
                value={designSlug}
                onChange={(e) => setDesignSlug(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="nero-signature">Nero Signature</option>
                <option value="calacatta-gallery">Calacatta Gallery</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="nero">Nero</option>
                  <option value="calacatta">Calacatta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cloth</label>
                <select
                  value={cloth}
                  onChange={(e) => setCloth(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="charcoal">Charcoal</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="brown">Brown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wood Accent</label>
                <select
                  value={wood}
                  onChange={(e) => setWood(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="black">Black</option>
                  <option value="walnut">Walnut</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full rounded-md bg-gray-900 text-white py-2.5 font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload & Generate Code"}
            </button>
          </form>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-medium text-green-800 mb-2">✓ Upload successful!</p>
                <p className="text-xs text-green-700">Image saved to: {result.url}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Add this to lib/marbleDesigns.ts in the "{designSlug}" variants array:
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                  {result.code}
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.code);
                    alert("Copied to clipboard!");
                  }}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Copy to clipboard
                </button>
              </div>

              <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Next step:</strong> Restart your dev server for changes to take effect.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
