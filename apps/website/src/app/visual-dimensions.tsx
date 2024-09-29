"use client";

import { useLayoutEffect } from "react";

export function VisualDimensions() {
  useLayoutEffect(() => {
    function refreshDimensions() {
      document.documentElement.style.setProperty(
        "--vvw",
        `${(window.visualViewport?.width ?? 0) / 100}px`,
      );
      document.documentElement.style.setProperty(
        "--vvh",
        `${(window.visualViewport?.height ?? 0) / 100}px`,
      );
    }

    refreshDimensions();

    window.visualViewport?.addEventListener("resize", refreshDimensions);

    return () =>
      window.visualViewport?.removeEventListener("resize", refreshDimensions);
  });

  return null;
}
