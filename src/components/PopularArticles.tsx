import { getPopularArticles } from "@/lib/strapi";

export default async function PopularArticles({ lang }: { lang: string }) {
  const popularArticles = await getPopularArticles(lang);
  console.log("Popular articles fetched in component:", popularArticles);
  return (
    <aside className="page-aside">
      <div className="aside-card">
        <h3 className="aside-heading">Popular Articles</h3>
        <ul className="aside-links">
          {popularArticles?.links &&
            [...popularArticles.links]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((article, index) => (
                <li
                  key={article.order ?? index}
                  data-order={article.order ?? index}
                >
                  <a href={`/${lang}/${article.slug}`}>
                    <i className="ti ti-arrow-right" aria-hidden="true"></i>
                    {article.label}
                  </a>
                </li>
              ))}

          <li>
            <a href="#">
              <i className="ti ti-arrow-right" aria-hidden="true"></i>
              EFT / RTGS
            </a>
          </li>
          <li>
            <a href="#">
              <i className="ti ti-arrow-right" aria-hidden="true"></i>
              International Transfers (TTs)
            </a>
          </li>
          <li>
            <a href="#">
              <i className="ti ti-arrow-right" aria-hidden="true"></i>
              URA Payment
            </a>
          </li>
        </ul>
      </div>

      <div className="aside-card" style={{ marginTop: "16px" }}>
        <h3 className="aside-heading">Need more help?</h3>
        <p
          style={{
            fontSize: "13px",
            color: "var(--c-text-secondary)",
            marginBottom: "12px",
          }}
        >
          Our support team is available 24/7.
        </p>
        <a href="#" className="contact-btn">
          <i className="ti ti-headset" aria-hidden="true"></i> Contact Support
        </a>
      </div>
    </aside>
  );
}
