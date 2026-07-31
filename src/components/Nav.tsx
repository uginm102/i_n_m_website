'use client';

import { getLocales } from "@/lib/strapi";
import LanguageSwitcher from "./LanguageSwitcher";
import LanguageSelector from "./LanguageSelector";

const locales = await getLocales();

export default function Nav({header}: {header: any}) {
  return (
    <nav className="nav">
      <a href="/" className="logo-img">
        <img
          src={process.env.NEXT_PUBLIC_STRAPI_API_URL + (header.logo?.url??'#')}
          alt="I&M Logo"
          style={{ height: "50px", width: "auto", marginTop: "5px" }}
        />
      </a>

      <div className="nav-right">
        {/* existing links */}
        <LanguageSwitcher locales={locales}/>
        {/* <LanguageSelector lang="en" /> */}
      </div>
    </nav>
  );
}


