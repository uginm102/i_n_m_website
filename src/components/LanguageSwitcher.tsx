// components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Locale = {
  code: string;
  name: string;
  isDefault?: boolean;
};

type Props = {
  locales: Locale[];
};

export default function LanguageSwitcher({ locales }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration gate
    setMounted(true);
  }, []);

  // Return a skeleton, a default server-safe UI, or null until mounted
  if (!mounted) {
    return <div className="lang-selector fallback">...</div>; 
    // Make sure this fallback exactly matches what the server renders!
  }

  const currentLang = pathname.split("/")[1] || "en";

  const switchLanguage = (newLang: string) => {
    if (newLang === currentLang) return;

    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/") || `/${newLang}`;

    router.push(newPath);
  };

  if (!locales || locales.length <= 1) return null;

  return (
    <div className="lang-selector">
      <i className="ti ti-world" aria-hidden="true"></i>
      <select
        className="lang-select"
        value={currentLang}
        onChange={(e) => switchLanguage(e.target.value)}
        aria-label="Select language"
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.name}
          </option>
        ))}
      </select>
    </div>
  );
}