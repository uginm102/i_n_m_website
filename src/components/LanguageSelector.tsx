// @/components/LanguageSelector.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";

// Adjust this list to match the locales configured in Strapi
// (Settings → Internationalization) — code must match exactly.
const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export default function LanguageSelector({ lang }: { lang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLang = e.target.value;
    if (nextLang === lang) return;

    // Swap only the leading /{lang} segment, keep the rest of the path
    const segments = pathname.split("/");
    segments[1] = nextLang;
    router.push(segments.join("/") || "/");
  };

  return (
    <div className="lang-selector">
      <i className="ti ti-world" aria-hidden="true"></i>
      <select
        className="lang-select"
        value={lang}
        onChange={handleChange}
        aria-label="Select language"
      >
        {LOCALES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
