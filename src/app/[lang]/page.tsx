// app/[lang]/page.tsx
import "@/styles/page.module.css";
import "@/styles/app-store.css";

import HeroBanner from "@/components/sections/HeroBanner";
import { fetchSingleType, type SupportPage } from "@/lib/strapi";
import Nav from "@/components/Nav";

import Footer from "@/components/Footer";
import Links from "@/components/sections/Links";
import Guides from "@/components/sections/Guides";
import MobileAppDownload from "@/components/sections/MobileAppDownload";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function SupportPage({ params }: Props) {
  const { lang = "en" } = await params;
  const pageData = await fetchSingleType<SupportPage>("support-page", {
    // Swap the flat array for an object to control deep population
    populate: {
      header: {
        populate: {
          logo: true, // ← This is the correct way for media inside a component
        },
      },
      hero: "*", // Populates all first-level fields in your hero component
      footer: "*", // Populates all first-level fields in your footer component
      links: "*", // Populates all first-level fields in your links component
      guides: "*",
      popularArticles: "*", // Populates all first-level fields in your popularArticles component
      mobileAppDownload: "*", // Populates all first-level fields in your mobileAppDownload component
    },
    locale: lang,
  });
  //console.log("Support Page Data:", pageData); // Debugging line to check the fetched data
  if (!pageData) return <div>Failed to load data.</div>;

  return (
    <>
      <Nav header={pageData?.header} lang={lang} />
      <main className="main-content">
        {/* 2. Map the Strapi data directly to the component's props */}
        <HeroBanner
          title={pageData.hero.title}
          searchPlaceholder={pageData.hero.searchPlaceholder}
          searchButtonText={pageData.hero.searchButtonText}
        />
        <div className="quick-links-wrap">
          <Links links={pageData.links} lang={lang} />
        </div>
        <section className="section">
          <h2 className="section-title">{pageData.guidesTitle}</h2>
          <div className="guides-grid">
            <Guides guides={pageData.guides} />
          </div>
        </section>

        <div className="popular-section">
          <div className="popular-inner">
            <h3 className="popular-heading">Popular Articles</h3>
            <div className="popular-chips">
              {pageData.popularArticles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  className="chip"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ti ti-arrow-right"></i>{article.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        {pageData.mobileAppDownload && (
          <MobileAppDownload
            title={pageData.mobileAppDownload.title}
            infoText={pageData.mobileAppDownload.infoText}
            appStoreUrl={pageData.mobileAppDownload.appStoreUrl}
            appStorePrefix={pageData.mobileAppDownload.appStorePrefix}
            appStoreLabel={pageData.mobileAppDownload.appStoreLabel}
            playStoreUrl={pageData.mobileAppDownload.playStoreUrl}
            playStorePrefix={pageData.mobileAppDownload.playStorePrefix}
            playStoreLabel={pageData.mobileAppDownload.playStoreLabel}
          />
        )}
      </main>
      <Footer content={pageData?.footer?.content ?? ""} />
    </>
  );
}
