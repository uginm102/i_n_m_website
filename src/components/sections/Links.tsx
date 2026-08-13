import { CustomLink } from "@/lib/strapi";
import Link from "next/link";

export default function Links({ links, lang }: { links: CustomLink[]; lang: string }) {
return (
    links.map((link, index) => (
      <Link 
      key={index} 
      href={`/${lang}/${link.slug}`} 
      className="quick-link">
          <i className={link.iconClass} aria-hidden="true"></i>
          <span>{link.label}</span>
        </Link>
    ))
);
}