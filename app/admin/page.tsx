"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import type { DesignRecord, VariantRecord, OptionGroup } from "@/lib/data";

export default function AdminDashboardPage() {
  const [designs, setDesigns] = useState<DesignRecord[]>([]);
  const [categories, setCategories] = useState<
    { slug: string; name: string; description?: string; hero_image_url?: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("marble");
  const [showAllDesigns, setShowAllDesigns] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    heroFile: null as File | null,
    hero_image_url: "",
  });
  const [selected, setSelected] = useState<DesignRecord | null>(null);
  const [variants, setVariants] = useState<VariantRecord[]>([]);
  const [designOptionGroups, setDesignOptionGroups] = useState<OptionGroup[]>([]);
  const [galleryItems, setGalleryItems] = useState<
    { id: string; title: string; type: string; image_url: string; sort_order?: number }[]
  >([]);
  const [galleryEdits, setGalleryEdits] = useState<Record<string, { title: string; type: string; sort_order?: number; image_url: string }>>({});
  const [galleryFiles, setGalleryFiles] = useState<Record<string, File | null>>({});
  const [galleryDirty, setGalleryDirty] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createdDesignName, setCreatedDesignName] = useState<string | null>(null);
  const variantSectionRef = useRef<HTMLDivElement | null>(null);

  // New design form state
  const [newDesign, setNewDesign] = useState({
    name: "",
    slug: "",
    category: "marble",
    short_description: "",
    heroFile: null as File | null,
  });

  // New variant form state
  const [variantForm, setVariantForm] = useState({
    file: null as File | null,
  });
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [newGroup, setNewGroup] = useState({ name: "", key: "" });
  const [newOptionInputs, setNewOptionInputs] = useState<Record<string, string>>({});
  const [newGallery, setNewGallery] = useState({
    title: "",
    type: "Pool Table",
    sort_order: 0,
    file: null as File | null,
  });

  useEffect(() => {
    loadDesigns();
    loadCategories();
    loadGallery();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/cloudflare/designs?all=1");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load designs");
      }
      const data = await response.json();
      const designsData = (data.designs as any) ?? [];
      setDesigns(designsData);
      if (selected) {
        const updated = designsData.find((d: any) => d.slug === selected.slug);
        if (updated) {
          setSelected(updated);
          setDesignOptionGroups(updated.option_groups ?? []);
        }
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/cloudflare/categories");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load categories");
      }
      const data = await response.json();
      const cats = (data.categories as any[]) ?? [];
      setCategories(cats);
      if (cats.length > 0) {
        const first = cats.find((c) => c.slug === selectedCategory) ?? cats[0];
        setSelectedCategory(first.slug);
        setCategoryForm({
          name: first.name ?? "",
          description: first.description ?? "",
          heroFile: null,
          hero_image_url: first.hero_image_url ?? "",
        });
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to load categories");
    }
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setShowAllDesigns(false);
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return;
    setCategoryForm({
      name: cat.name ?? "",
      description: cat.description ?? "",
      heroFile: null,
      hero_image_url: cat.hero_image_url ?? "",
    });
    // Preselect category for new designs
    setNewDesign((prev) => ({ ...prev, category: slug }));
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      let heroImageUrl = categoryForm.hero_image_url;

      if (categoryForm.heroFile) {
        const formData = new FormData();
        formData.append("file", categoryForm.heroFile);
        formData.append("designSlug", `category-${selectedCategory}`);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "Category hero upload failed");
        }
        heroImageUrl = uploadData.url;
      }

      const response = await fetch("/api/cloudflare/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selectedCategory,
          name: categoryForm.name,
          description: categoryForm.description,
          hero_image_url: heroImageUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update category");
      }

      await loadCategories();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update category");
    }
  };

  const loadGallery = async () => {
    try {
      const response = await fetch("/api/cloudflare/gallery");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to load gallery");
      }
      const data = await response.json();
      const items = (data.items as any[]) ?? [];
      setGalleryItems(items);
      const editMap: Record<string, { title: string; type: string; sort_order?: number; image_url: string }> = {};
      items.forEach((item) => {
        editMap[item.id] = {
          title: item.title,
          type: item.type,
          sort_order: item.sort_order ?? 0,
          image_url: item.image_url,
        };
      });
      setGalleryEdits(editMap);
      setGalleryDirty({});
    } catch (err: any) {
      setError(err?.message ?? "Failed to load gallery");
    }
  };

  const handleCreateGallery = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGallery.file) {
      setError("Select an image for the gallery item.");
      return;
    }
    try {
      setError(null);
      const formData = new FormData();
      formData.append("file", newGallery.file);
      formData.append("designSlug", "gallery");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Gallery image upload failed");
      }

      const response = await fetch("/api/cloudflare/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newGallery.title,
          type: newGallery.type,
          image_url: uploadData.url,
          sort_order: newGallery.sort_order,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create gallery item");
      }

      setNewGallery({ title: "", type: "Pool Table", sort_order: 0, file: null });
      const input = document.getElementById("gallery-file") as HTMLInputElement | null;
      if (input) input.value = "";
      await loadGallery();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create gallery item");
    }
  };

  const handleSaveGallery = async (id: string) => {
    try {
      setError(null);
      const edits = galleryEdits[id];
      if (!edits) return;

      let imageUrl = edits.image_url;
      const file = galleryFiles[id];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("designSlug", "gallery");
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "Gallery image upload failed");
        }
        imageUrl = uploadData.url;
      }

      const response = await fetch("/api/cloudflare/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: edits.title,
          type: edits.type,
          image_url: imageUrl,
          sort_order: edits.sort_order ?? 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update gallery item");
      }
      setGalleryFiles((prev) => ({ ...prev, [id]: null }));
      await loadGallery();
    } catch (err: any) {
      setError(err?.message ?? "Failed to update gallery item");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/cloudflare/gallery?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete gallery item");
      }
      await loadGallery();
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete gallery item");
    }
  };

  const handleCreateDesign = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      let heroImageUrl: string | null = null;

      if (newDesign.heroFile) {
        const formData = new FormData();
        formData.append("file", newDesign.heroFile);
        formData.append("designSlug", newDesign.slug);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "Hero image upload failed");
        }
        heroImageUrl = uploadData.url;
      }

      const response = await fetch("/api/cloudflare/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDesign.name,
          slug: newDesign.slug,
          category: newDesign.category,
          short_description: newDesign.short_description,
          hero_image_url: heroImageUrl,
          is_featured: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create design");
      }

      const created = data.design as DesignRecord;
      setNewDesign({ name: "", slug: "", category: "marble", short_description: "", heroFile: null });
      setCreatedDesignName(created.name);
      await loadDesigns();
      // Automatically select the newly created design so the variants panel is ready
      await loadVariants(created);
      // Scroll to variants section to encourage next step
      setTimeout(() => {
        variantSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create design");
    }
  };

  const loadVariants = async (design: DesignRecord) => {
    try {
      setError(null);
      const response = await fetch(
        `/api/cloudflare/variants?design_slug=${encodeURIComponent(design.slug)}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load variants");
      }
      setVariants((data.variants as any) ?? []);
      setSelected(design);
      setDesignOptionGroups(design.option_groups ?? []);
      if ((design.option_groups ?? []).length > 0) {
        const defaults: Record<string, string> = {};
        design.option_groups?.forEach((g) => {
          defaults[g.key] = g.options?.[0] ?? "";
        });
        setVariantSelections(defaults);
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to load variants");
    }
  };

  const toKey = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

  const handleAddGroup = () => {
    const key = newGroup.key ? toKey(newGroup.key) : toKey(newGroup.name);
    if (!key || !newGroup.name) return;
    if (designOptionGroups.some((g) => g.key === key)) return;
    setDesignOptionGroups([
      ...designOptionGroups,
      { key, name: newGroup.name, options: [] },
    ]);
    setNewGroup({ name: "", key: "" });
  };

  const handleAddOption = (groupKey: string) => {
    const value = (newOptionInputs[groupKey] ?? "").trim();
    if (!value) return;
    setDesignOptionGroups((prev) =>
      prev.map((g) =>
        g.key === groupKey && !g.options.includes(value)
          ? { ...g, options: [...g.options, value] }
          : g
      )
    );
    setNewOptionInputs((prev) => ({ ...prev, [groupKey]: "" }));
  };

  const handleSaveOptionGroups = async () => {
    if (!selected) return;
    try {
      setError(null);
      const response = await fetch("/api/cloudflare/designs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selected.slug,
          option_groups: designOptionGroups,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save option groups");
      }
      await loadDesigns();
    } catch (err: any) {
      setError(err?.message ?? "Failed to save option groups");
    }
  };

  const handleCreateVariant = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected || !variantForm.file) return;
    if (designOptionGroups.length === 0) {
      setError("Add option groups before creating variants.");
      return;
    }

    try {
      setError(null);

      // If user typed new option values, add them to the group definitions
      const updatedGroups = designOptionGroups.map((group) => {
        const chosen = (variantSelections[group.key] ?? "").trim();
        if (chosen && !group.options.includes(chosen)) {
          return { ...group, options: [...group.options, chosen] };
        }
        return group;
      });

      if (JSON.stringify(updatedGroups) !== JSON.stringify(designOptionGroups)) {
        const updateResponse = await fetch("/api/cloudflare/designs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: selected.slug,
            option_groups: updatedGroups,
          }),
        });
        const updateData = await updateResponse.json();
        if (!updateResponse.ok) {
          throw new Error(updateData.error || "Failed to update option groups");
        }
        setDesignOptionGroups(updatedGroups);
      }

      // Step 1: Upload image to R2/local storage
      const formData = new FormData();
      formData.append("file", variantForm.file);
      formData.append("designSlug", selected.slug);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Upload failed");
      }

      // Step 2: Save variant metadata to Cloudflare D1/API
      const variantResponse = await fetch("/api/cloudflare/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          design_slug: selected.slug,
          image_url: uploadData.url,
          options: variantSelections,
        }),
      });

      const variantData = await variantResponse.json();
      if (!variantResponse.ok) {
        throw new Error(variantData.error || "Failed to save variant");
      }

      // Reset form
      setVariantForm({ file: null });
      const fileInput = document.getElementById("variant-file") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";

      // Reload variants
      await loadVariants(selected);

      alert(`✅ Variant uploaded successfully!\n\nStorage: ${uploadData.storage || "local"}\nImage: ${uploadData.url}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create variant");
    }
  };

  if (loading && designs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KITOS Admin</h1>
            <p className="text-sm text-gray-600">Manage designs and image variants used in the configurator.</p>
          </div>
          <span className="text-xs text-gray-500">
            Protected by Cloudflare Access
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,3fr] gap-8">
          {/* Designs column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => handleSelectCategory(c.slug)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                      selectedCategory === c.slug
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {c.name ?? c.slug}
                  </button>
                ))}
              </div>
              <form onSubmit={handleUpdateCategory} className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-700 mb-1">Category name</label>
                  <input
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, description: e.target.value })
                    }
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Hero image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setCategoryForm({ ...categoryForm, heroFile: file });
                    }}
                    className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                  />
                  {categoryForm.hero_image_url && (
                    <p className="mt-2 text-[11px] text-gray-500 truncate">
                      Current: {categoryForm.hero_image_url}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-gray-900 text-white py-1.5 font-semibold text-sm hover:bg-gray-800"
                >
                  Save category
                </button>
              </form>
            </div>
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Designs</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Showing: {showAllDesigns ? "All categories" : selectedCategory}
                  </p>
                </div>
                <button
                  onClick={() => setShowAllDesigns((prev) => !prev)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-400"
                >
                  {showAllDesigns ? "Filter by category" : "Show all"}
                </button>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(selectedCategory
                  ? showAllDesigns
                    ? designs
                    : designs.filter((d) => d.category === selectedCategory)
                  : designs
                ).map((d, index) => (
                  <button
                    key={d.id ?? d.slug ?? index}
                    onClick={() => loadVariants(d)}
                    className={`w-full text-left px-3 py-2 rounded-md border text-sm mb-1 ${
                      selected?.id === d.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.slug} · {d.category}</div>
                  </button>
                ))}
                {designs.length === 0 && (
                  <p className="text-sm text-gray-500">No designs yet. Create one below.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-3">New design</h2>
              <form onSubmit={handleCreateDesign} className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    value={newDesign.name}
                    onChange={(e) => setNewDesign({ ...newDesign, name: e.target.value })}
                    required
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Slug</label>
                  <input
                    value={newDesign.slug}
                    onChange={(e) => setNewDesign({ ...newDesign, slug: e.target.value })}
                    required
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs"
                    placeholder="e.g. nero-signature"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Category</label>
                  <select
                    value={newDesign.category}
                    onChange={(e) => setNewDesign({ ...newDesign, category: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  >
                    <option value="marble">Marble</option>
                    <option value="wood">Wood</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Short description</label>
                  <textarea
                    value={newDesign.short_description}
                    onChange={(e) => setNewDesign({ ...newDesign, short_description: e.target.value })}
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Hero image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setNewDesign({ ...newDesign, heroFile: file });
                    }}
                    className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-gray-900 text-white py-1.5 font-semibold text-sm hover:bg-gray-800"
                >
                  Create design
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-semibold mb-4">Gallery</h2>

              <form onSubmit={handleCreateGallery} className="space-y-3 text-sm mb-6">
                <div>
                  <label className="block text-gray-700 mb-1">Title</label>
                  <input
                    value={newGallery.title}
                    onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                    required
                    className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 mb-1 text-xs">Type</label>
                    <input
                      value={newGallery.type}
                      onChange={(e) => setNewGallery({ ...newGallery, type: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Pool Table"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-xs">Sort order</label>
                    <input
                      type="number"
                      value={newGallery.sort_order}
                      onChange={(e) =>
                        setNewGallery({ ...newGallery, sort_order: Number(e.target.value) })
                      }
                      className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-xs">Image</label>
                  <input
                    id="gallery-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewGallery({ ...newGallery, file: e.target.files?.[0] ?? null })
                    }
                    className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newGallery.file}
                  className="w-full rounded-md bg-gray-900 text-white py-1.5 font-semibold text-sm hover:bg-gray-800 disabled:opacity-60"
                >
                  Add gallery item
                </button>
              </form>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {galleryItems.length === 0 ? (
                  <p className="text-xs text-gray-500">No gallery items yet.</p>
                ) : (
                  galleryItems.map((item) => (
                    <div key={item.id} className="rounded-md border border-gray-200 p-3">
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                            {galleryEdits[item.id]?.image_url || item.image_url ? (
                              <img
                                src={galleryEdits[item.id]?.image_url ?? item.image_url}
                                alt={galleryEdits[item.id]?.title ?? item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              value={galleryEdits[item.id]?.title ?? item.title}
                              onChange={(e) => {
                                setGalleryEdits((prev) => ({
                                  ...prev,
                                  [item.id]: {
                                    ...(prev[item.id] ?? item),
                                    title: e.target.value,
                                  },
                                }));
                                setGalleryDirty((prev) => ({ ...prev, [item.id]: true }));
                              }}
                              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={galleryEdits[item.id]?.type ?? item.type}
                            onChange={(e) => {
                              setGalleryEdits((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...(prev[item.id] ?? item),
                                  type: e.target.value,
                                },
                              }));
                              setGalleryDirty((prev) => ({ ...prev, [item.id]: true }));
                            }}
                            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5"
                          />
                          <input
                            type="number"
                            value={galleryEdits[item.id]?.sort_order ?? item.sort_order ?? 0}
                            onChange={(e) => {
                              setGalleryEdits((prev) => ({
                                ...prev,
                                [item.id]: {
                                  ...(prev[item.id] ?? item),
                                  sort_order: Number(e.target.value),
                                },
                              }));
                              setGalleryDirty((prev) => ({ ...prev, [item.id]: true }));
                            }}
                            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5"
                          />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            setGalleryFiles((prev) => ({
                              ...prev,
                              [item.id]: e.target.files?.[0] ?? null,
                            }));
                            setGalleryDirty((prev) => ({ ...prev, [item.id]: true }));
                          }}
                          className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                        />
                        <div className="flex items-center justify-between">
                          {galleryDirty[item.id] ? (
                            <button
                              onClick={() => handleSaveGallery(item.id)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-400"
                            >
                              Save
                            </button>
                          ) : (
                            <span className="text-[11px] text-gray-400">No changes</span>
                          )}
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Variants column */}
          <div className="bg-white rounded-lg shadow p-5" ref={variantSectionRef}>
            <h2 className="text-lg font-semibold mb-1">Variants</h2>
            {createdDesignName && (
              <div className="mt-2 mb-4 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">
                Step 2: Add variants for <span className="font-semibold">{createdDesignName}</span>.
              </div>
            )}
            {selected ? (
              <p className="text-sm text-gray-600 mb-4">
                {selected.name} · {selected.slug}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-4">Select a design on the left to manage its variants.</p>
            )}

            {selected && (
              <>
                <div className="mb-6 rounded-md border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Option groups</h3>
                    <button
                      onClick={handleSaveOptionGroups}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-400"
                    >
                      Save groups
                    </button>
                  </div>

                  {designOptionGroups.length === 0 ? (
                    <p className="text-xs text-gray-500 mb-3">
                      No option groups yet. Add groups like “Marble”, “Cloth”, “Pocket leather color”.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {designOptionGroups.map((group) => (
                        <div key={group.key} className="rounded-md border border-gray-200 p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <input
                              value={group.name}
                              onChange={(e) =>
                                setDesignOptionGroups((prev) =>
                                  prev.map((g) =>
                                    g.key === group.key ? { ...g, name: e.target.value } : g
                                  )
                                )
                              }
                              className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs"
                              placeholder="Group name"
                            />
                            <input
                              value={group.key}
                              onChange={(e) =>
                                setDesignOptionGroups((prev) =>
                                  prev.map((g) =>
                                    g.key === group.key ? { ...g, key: toKey(e.target.value) } : g
                                  )
                                )
                              }
                              className="w-32 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs"
                              placeholder="key"
                            />
                            <button
                              onClick={() =>
                                setDesignOptionGroups((prev) =>
                                  prev.filter((g) => g.key !== group.key)
                                )
                              }
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {group.options.map((opt) => (
                              <span
                                key={opt}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 text-[11px]"
                              >
                                {opt}
                                <button
                                  onClick={() =>
                                    setDesignOptionGroups((prev) =>
                                      prev.map((g) =>
                                        g.key === group.key
                                          ? { ...g, options: g.options.filter((o) => o !== opt) }
                                          : g
                                      )
                                    )
                                  }
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              value={newOptionInputs[group.key] ?? ""}
                              onChange={(e) =>
                                setNewOptionInputs((prev) => ({
                                  ...prev,
                                  [group.key]: e.target.value,
                                }))
                              }
                              className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs"
                              placeholder="Add option"
                            />
                            <button
                              onClick={() => handleAddOption(group.key)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-400"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <input
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs"
                      placeholder="New group name"
                    />
                    <input
                      value={newGroup.key}
                      onChange={(e) => setNewGroup({ ...newGroup, key: e.target.value })}
                      className="w-32 rounded-md border border-gray-300 px-2.5 py-1.5 text-xs"
                      placeholder="key (optional)"
                    />
                    <button
                      onClick={handleAddGroup}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-400"
                    >
                      Add group
                    </button>
                  </div>
                </div>

                <div className="mb-4 max-h-64 overflow-y-auto border border-gray-100 rounded-md p-2">
                  {variants.length > 0 ? (
                    variants.map((v, index) => (
                      <div
                        key={
                          v.id ??
                          `${v.design_id ?? selected?.id ?? "design"}-${v.material}-${v.cloth}-${v.wood_accent}-${index}`
                        }
                        className="flex items-center justify-between px-2 py-1.5 text-xs border-b last:border-b-0 border-gray-100"
                      >
                        <div>
                          <div className="font-medium">
                            {Object.entries(v.options ?? {
                              material: v.material,
                              cloth: v.cloth,
                              wood_accent: v.wood_accent,
                            })
                              .map(([k, val]) => `${k}: ${val}`)
                              .join(" · ")}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate max-w-xs">{v.image_url}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No variants yet for this design.</p>
                  )}
                </div>

                <form onSubmit={handleCreateVariant} className="space-y-3 text-sm">
                  <h3 className="font-semibold">Add variant</h3>
                  {designOptionGroups.length === 0 ? (
                    <p className="text-xs text-gray-500">
                      Add option groups above before creating variants.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {designOptionGroups.map((group) => (
                        <div key={group.key}>
                          <label className="block text-gray-700 mb-1 text-xs">{group.name}</label>
                          <input
                            list={`options-${group.key}`}
                            value={variantSelections[group.key] ?? ""}
                            onChange={(e) =>
                              setVariantSelections((prev) => ({
                                ...prev,
                                [group.key]: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder={`Select or type ${group.name.toLowerCase()}`}
                            required
                          />
                          <datalist id={`options-${group.key}`}>
                            {group.options.map((opt) => (
                              <option key={opt} value={opt} />
                            ))}
                          </datalist>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-700 mb-1 text-xs">Image file</label>
                    <input
                      id="variant-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setVariantForm({ ...variantForm, file });
                      }}
                      className="block w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                    />
                  </div>
                  <button
                    type="submit"
                      disabled={!variantForm.file || designOptionGroups.length === 0}
                      className="rounded-md bg-gray-900 text-white px-4 py-1.5 text-sm font-semibold hover:bg-gray-800 disabled:opacity-60"
                    >
                      Save variant
                    </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
