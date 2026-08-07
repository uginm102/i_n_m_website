// app/[lang]/services/[category]/[slug]/page.tsx
import { getServiceGuideBySlug, fetchSingleType, type SupportPage } from "@/lib/strapi";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServiceGuide from "@/components/sections/ServiceGuide";
import Link from "next/link";

type Props = {
  params: Promise<{
    lang: string;
    category: string;
    slug: string;
  }>;
};

export default async function ServiceDetailPage({ params }: Props) {
  const { lang, category, slug } = await params;

  // Fetch the specific Service Guide
  const guide = await getServiceGuideBySlug(slug, lang);

  

  // Fetch header & footer
  const pageData = await fetchSingleType<SupportPage>("support-page", {
    populate: {
      header: {
        populate: {
          logo: true,
        },
      },
      footer: "*",
    },
    locale: lang,
  });
if (!guide) {
  return (
    <>
      <Nav header={pageData?.header} lang={lang} />

      <div className="page-layout">
        <main className="page-main">
          <div className="not-available">
            <div className="not-available-card">
              <i className="ti ti-language-off" style={{ fontSize: 36, marginBottom: 16 }}></i>
              <h1>Content not available</h1>
              <p>This guide is not available in this language yet.</p>

              <Link href={`/${lang}/services/${category}`} className="back-link">
                ← Back to category
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer content={pageData?.footer?.content?? ""} />
    </>
  );
}

  return (
    <>
     <Nav header={pageData?.header} lang={lang} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <Link href={`/${lang}`} className="breadcrumb-link">
          Help
        </Link>
        <i className="ti ti-chevron-right breadcrumb-sep" aria-hidden="true" />
        <Link
          href={`/${lang}/services/${category}`}
          className="breadcrumb-link"
        >
          {category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </Link>
        <i className="ti ti-chevron-right breadcrumb-sep" aria-hidden="true" />
        <span className="breadcrumb-current">{guide.title}</span>
      </div>

      <div className="page-layout">
        <main className="page-main">
          <ServiceGuide
            title={guide.title}
            shortDescription={guide.description}
            steps={guide.steps || []}
          />

          {/* Optional info / notice */}
          {guide.info && (
            <div className="article-notice" style={{ marginTop: 32 }}>
              <i className="ti ti-info-circle" aria-hidden="true" />
              <p>{guide.info}</p>
            </div>
          )}
        </main>

        {/* Aside */}
        <aside className="page-aside">
          <div className="aside-card">
            <h3 className="aside-heading">Popular Articles</h3>
            <ul className="aside-links">
              <li>
                <a href="#">
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                  Mobile Money
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                  EFT / RTGS
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                  International Transfers (TTs)
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                  URA Payment
                </a>
              </li>
            </ul>
          </div>

          <div className="aside-card" style={{ marginTop: 16 }}>
            <h3 className="aside-heading">Need more help?</h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--c-text-secondary)",
                marginBottom: 12,
              }}
            >
              Our support team is available 24/7.
            </p>
            <a href="#" className="contact-btn">
              <i className="ti ti-headset" aria-hidden="true" /> Contact Support
            </a>
          </div>
        </aside>
      </div>

      <Footer content={pageData?.footer?.content?? ""} />
    </>
  );
}