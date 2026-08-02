import "@/styles/page.module.css";
import "@/styles/app-store.css";

// app/[lang]/page.tsx
import HeroBanner from "@/components/sections/HeroBanner";
import { fetchSingleType, type SupportPage } from "@/lib/strapi";
import Nav from "@/components/Nav";

import Footer from "@/components/Footer";
import Links from "@/components/sections/Links";
import Guides from "@/components/sections/Guides";

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
    },
    locale: lang,
  });
console.log("Support Page Data:", pageData); // Debugging line to check the fetched data
  if (!pageData) return <div>Failed to load data.</div>;

  return (
    <>
      <Nav header={pageData.header} />
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
          <h2 className="section-title">Useful Guides</h2>
          <div className="guides-grid">
            <Guides guides={pageData.guides} />
          </div>
        </section>

        <div className="popular-section">
          <div className="popular-inner">
            <h3 className="popular-heading">Popular Articles</h3>
            <div className="popular-chips">
              <a href="im-mobile-money.html" className="chip">
                <i className="ti ti-arrow-right"></i>Mobile Money
              </a>
              <a href="im-eft-rtgs.html" className="chip">
                <i className="ti ti-arrow-right"></i>EFT / RTGS
              </a>
              <a href="im-international-transfers.html" className="chip">
                <i className="ti ti-arrow-right"></i>International Transfers (TTs)
              </a>
              <a href="im-ura-payment.html" className="chip">
                <i className="ti ti-arrow-right"></i>URA Payment
              </a>
            </div>
          </div>
        </div>
        <div className="footer-cta">
          <p>Get the latest On The Go app now!</p>

          <div className="buttons-wrapper">
            <a
              href="https://apps.apple.com/ug/app/i-m-bank-on-the-go-ug/id6478019315"
              className="store-button appstore-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the Apple App Store"
            >
              <div className="apple-icon" aria-hidden="true"></div>
              <div className="btn-text">
                <span className="small-line">Download on the</span>
                <span className="main-line">App Store</span>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.inm.uganda"
              className="store-button googleplay-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
            >
              <div className="google-icon" aria-hidden="true"></div>
              <div className="btn-text">
                <span className="small-line">Get it on</span>
                <span className="main-line">Google Play</span>
              </div>
            </a>
          </div>

          <hr />
          <div className="info-text">
            ⚡ Tap a button to download from your device's official store
          </div>
        </div>
      </main>
      <Footer content={pageData?.footer?.content} />
    </>
  );
}
