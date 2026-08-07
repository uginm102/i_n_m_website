//'use client';

import { getLocales, Header } from "@/lib/strapi";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import Image from "next/image";

const locales = await getLocales();

export default function Nav({header, lang}: {header?: Header; lang: string}) {
  return (
    <nav className="nav">
      <Link href={`/${lang}`} className="logo-img">
        <Image
          src={process.env.NEXT_PUBLIC_STRAPI_API_URL + (header?.logo?.url??'#')}
          alt="I&M Logo"
          style={{ height: "50px", width: "auto", marginTop: "5px" }}
          width={100}
          height={50}
        />
      </Link>

      <div className="nav-right">
        <LanguageSwitcher locales={locales}/>
      </div>
    </nav>
  );
}


