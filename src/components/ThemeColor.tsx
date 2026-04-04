"use client";

import { useEffect } from "react";

const colors = {
  light: "#ffffff",
  dark: "#0a0a0a",
};

function setThemeColor() {
  const isDark = document.documentElement.classList.contains("dark");
  const color = isDark ? colors.dark : colors.light;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = color;
}

export function ThemeColor() {
  useEffect(() => {
    setThemeColor();

    const observer = new MutationObserver(setThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
