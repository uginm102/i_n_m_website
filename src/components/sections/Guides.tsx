export default function Links({guides}: {guides: any[]}) {
return (
    guides.map((guide, index) => (

        <a key={index} href={guide.url} className="guide-card">
            <div className="guide-img">
              <i className={guide.iconClass} aria-hidden="true"></i>
            </div>
            <div className="guide-body">
              <p className="guide-tag">{guide.tag}</p>
              <h3 className="guide-title">{guide.title}</h3>
              <p className="guide-desc">
                {guide.description}
              </p>
            </div>
          </a>
    ))
);
}