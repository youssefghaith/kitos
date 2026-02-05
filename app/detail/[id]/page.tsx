"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MARBLE_TABLE_1 } from "@/lib/tableData";
import { buildImageMapFromDesign } from "@/lib/marbleDesigns";
import { getDesignRecord, getDesignVariants } from "@/lib/designsData";
import type { OptionGroup } from "@/lib/data";

const CTA_WHATSAPP = "https://wa.me/1234567890"; // replace later

type SwatchProps = {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
};

function Swatches({ options, value, onChange }: SwatchProps) {
  const colorChip: Record<string, string> = {
    charcoal: "#2d2d2d",
    blue: "#1f4ea3",
    green: "#186a2c",
    brown: "#6b4f3a",
    nero: "#0f0f10",
    calacatta: "#f2f2f2",
    black: "#111",
    walnut: "#7b5b38",
  };
  return (
    <div role="radiogroup" aria-label="options" className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          role="radio"
          aria-checked={value === o.value}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition ${
            value === o.value
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
          }`}
        >
          <span
            aria-hidden
            className="inline-block w-4 h-4 rounded-full border"
            style={{
              backgroundColor: colorChip[o.value] ?? "#e5e7eb",
              borderColor: value === o.value ? "#fff" : "#d1d5db",
            }}
          />
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function DetailPage() {
  const params = useParams<{ id: string }>();
  const config = useMemo(() => {
    if (params?.id === MARBLE_TABLE_1.id) return MARBLE_TABLE_1;
    return MARBLE_TABLE_1; // single page for now
  }, [params?.id]);

  const search = useSearchParams();
  const router = useRouter();

  const designSlug = search.get("design") ?? "nero-signature";

  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeImageMap, setActiveImageMap] = useState<Record<string, string>>({});
  const [shareUrl, setShareUrl] = useState<string>("");

  const defaultGroups: OptionGroup[] = useMemo(() => {
    return [
      {
        key: "material",
        name: "Material",
        options: config.materials.map((m) => m.value),
      },
      {
        key: "cloth",
        name: "Cloth color",
        options: config.clothColors.map((c) => c.value),
      },
      {
        key: "wood_accent",
        name: "Wood accents",
        options: config.woodAccents.map((w) => w.value),
      },
    ];
  }, [config]);

  const groupKeys = useMemo(() => optionGroups.map((g) => g.key), [optionGroups]);

  const buildKey = (options: Record<string, string>) =>
    groupKeys.map((k) => options[k] ?? "").join("|");

  const resolveInitialSelections = (groups: OptionGroup[]) => {
    const initial: Record<string, string> = {};
    groups.forEach((g) => {
      const legacyKeyMap: Record<string, string> = {
        material: "m",
        cloth: "c",
        wood_accent: "w",
      };
      const queryValue = search.get(g.key) ?? (legacyKeyMap[g.key] ? search.get(legacyKeyMap[g.key]) : null);
      const fallback =
        g.key === "material"
          ? config.defaults.material
          : g.key === "cloth"
          ? config.defaults.clothColor
          : g.key === "wood_accent"
          ? config.defaults.woodAccent
          : g.options[0];
      initial[g.key] = queryValue ?? fallback ?? "";
    });
    return initial;
  };

  // Fetch variants and design option groups
  useEffect(() => {
    // Start with local data
    const localMap = buildImageMapFromDesign(designSlug);
    setActiveImageMap(localMap);

    Promise.all([getDesignRecord(designSlug), getDesignVariants(designSlug)])
      .then(([design, variants]) => {
        const groups =
          design?.option_groups && design.option_groups.length > 0
            ? design.option_groups
            : defaultGroups;
        setOptionGroups(groups);
        setSelections(resolveInitialSelections(groups));

        if (variants && variants.length > 0) {
          const apiMap: Record<string, string> = {};
          const keys = groups.map((g: OptionGroup) => g.key);
          variants.forEach((v: any) => {
            const options =
              v.options ??
              {
                material: v.material,
                cloth: v.cloth,
                wood_accent: v.wood_accent,
              };
            const mapKey = keys.map((k) => options?.[k] ?? "").join("|");
            apiMap[mapKey] = v.image_url;
          });
          setActiveImageMap(apiMap);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch variants:", err);
        setOptionGroups(defaultGroups);
        setSelections(resolveInitialSelections(defaultGroups));
      });
  }, [designSlug]);

  // Compute current image src
  const { src, hasImage } = useMemo(() => {
    const mapped = activeImageMap?.[buildKey(selections)];
    return {
      src: mapped ?? config.fallbackSrc ?? "/gallery/pool-table-1.png",
      hasImage: Boolean(mapped),
    };
  }, [activeImageMap, config.fallbackSrc, selections, groupKeys]);

  // Fade and shimmer control
  useEffect(() => {
    setFade(false);
    setLoading(true);
    const t = requestAnimationFrame(() => setFade(true));
    return () => cancelAnimationFrame(t);
  }, [src]);

  // Reflect selection in the URL (shallow)
  useEffect(() => {
    if (groupKeys.length === 0) return;
    const params = new URLSearchParams({ design: designSlug });
    groupKeys.forEach((key) => {
      if (selections[key]) params.set(key, selections[key]);
    });
    if (selections.material) params.set("m", selections.material);
    if (selections.cloth) params.set("c", selections.cloth);
    if (selections.wood_accent) params.set("w", selections.wood_accent);
    router.replace(`?${params.toString()}`);
  }, [selections, designSlug, router, groupKeys]);

  // Preload likely next images (same material, other cloths)
  useEffect(() => {
    const toPreload = new Set<string>();
    Object.values(activeImageMap).forEach((p) => {
      if (p && p !== src) toPreload.add(p);
    });
    toPreload.forEach((p) => {
      const img = new window.Image();
      img.src = p;
    });
  }, [activeImageMap, src]);

  const shareText = encodeURIComponent(
    [
      `KITOS Inquiry: ${config.title}`,
      ...groupKeys.map((k) => `${k}: ${selections[k] ?? ""}`),
      `Link: ${shareUrl}`,
    ].join("\n")
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-sm text-gray-600 hover:underline">← Back</Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {/* Left: hero */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full aspect-[3/2]">
              {loading && (
                <div className="absolute inset-0 animate-pulse bg-gray-100" />
              )}
              {!hasImage && (
                <div className="absolute left-3 top-3 z-10 rounded bg-amber-500 text-white text-xs font-semibold px-2 py-1 shadow">
                  Photo coming soon
                </div>
              )}
              <Image
                key={src}
                src={src}
                alt={`${config.title} preview`}
                fill
                className={`object-cover transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onLoadingComplete={() => setLoading(false)}
              />
            </div>
          </div>

          {/* Right: controls */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-600 mt-2">{config.description}</p>

            <div className="mt-6 space-y-6">
              {optionGroups.map((group) => (
                <div key={group.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {group.name}
                  </label>
                  <Swatches
                    options={group.options.map((o) => ({ value: o, label: o }))}
                    value={selections[group.key] ?? ""}
                    onChange={(val) =>
                      setSelections((prev) => ({
                        ...prev,
                        [group.key]: val,
                      }))
                    }
                  />
                </div>
              ))}

              <a
                href={`${CTA_WHATSAPP}?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 text-white px-6 py-3 font-semibold hover:bg-gray-800"
                aria-label="Request this configuration via WhatsApp"
              >
                Request this configuration
              </a>

              <p className="text-xs text-gray-500">Don’t see a photo for a combo? We’ll photograph it on request. Your selections are shareable via the page URL.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
