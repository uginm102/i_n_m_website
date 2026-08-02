// app/[lang]/search/page.tsx
import { searchHelpArticles, getSupportPageShell } from "@/lib/strapi";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const pageData = await getSupportPageShell(lang);
  const results = query ? await searchHelpArticles(query, lang) : [];

  return (
    <>
      <Nav header={pageData?.header} />
      <div className="page-layout">
        <main className="page-main">
          <div className="search-page">
            <div className="search-header">
              <h1 className="page-heading">
                {query ? `Results for “${query}”` : "Search"}
              </h1>
              <p className="search-subtitle">
                {query
                  ? `${results.length} result${results.length !== 1 ? "s" : ""} found`
                  : "Find help articles and guides"}
              </p>

              <div className="search-bar-wrapper">
                <SearchBar placeholder="Search again..." buttonText="Search" />
              </div>
            </div>

            <div className="search-content">
              {query && results.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="ti ti-search-off"></i>
                  </div>
                  <h2>No results found</h2>
                  <p>
                    We couldn’t find anything matching{" "}
                    <strong>“{query}”</strong>.
                    <br />
                    Try different keywords or browse the categories.
                  </p>
                  <Link href={`/${lang}`} className="back-home-btn">
                    ← Back to Help Center
                  </Link>
                </div>
              ) : (
                <div className="search-results">
                  {results.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${lang}/services/${item.categorySlug}/${item.slug}`}
                      className="search-result-card"
                    >
                      <div className="result-content">
                        <span className="result-category">
                          {item.categoryTitle}
                        </span>
                        <h3>{item.title}</h3>
                        {item.description && <p>{item.description}</p>}
                      </div>
                      <i className="ti ti-chevron-right result-arrow"></i>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer content={pageData?.footer?.content?? ""} />
    </>
  );
}
