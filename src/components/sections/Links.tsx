export default function Links({links}: {links: any[]}) {
return (
    links.map((link, index) => (
      <a key={index} href={link.url} className="quick-link">
          <i className={link.iconClass} aria-hidden="true"></i>
          <span>{link.label}</span>
        </a>
        // <a key={index} href={link.url} className="quick-link">
        //     <div className="quick-link-content">
        //         <h3>{link.title}</h3>
        //         <p>{link.description}</p>
        //     </div>
        // </a>
    ))
);
}