export default function Links({ links, lang }: { links: any[]; lang: string }) {
return (
    links.map((link, index) => (
      <a key={index} href={`/${lang}/${link.slug}`} className="quick-link">
          <i className={link.iconClass} aria-hidden="true"></i>
          <span>{link.label}</span>
        </a>
    ))
);
}