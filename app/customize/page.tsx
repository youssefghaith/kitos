"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CustomizePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to pool table customizer
    router.push("/customize/pool");
  }, [router]);

  return null;
}
