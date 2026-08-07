import { Link } from "@/lib/strapi";

export default function Links({ links, lang }: { links: Link[]; lang: string }) {
return (
    links.map((link, index) => (
      <a key={index} href={`/${lang}/${link.slug}`} className="quick-link">
          <i className={link.iconClass} aria-hidden="true"></i>
          <span>{link.label}</span>
        </a>
    ))
);
}