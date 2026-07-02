"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function PrintResumeHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("print") !== "resume") {
      return;
    }

    const printTimer = window.setTimeout(() => {
      window.print();
    }, 450);

    return () => window.clearTimeout(printTimer);
  }, [searchParams]);

  return null;
}
