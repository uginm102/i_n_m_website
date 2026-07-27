import "./page.module.css";

// app/[lang]/page.tsx
import HeroBanner from '@/components/sections/HeroBanner';
import { fetchSingleType } from '@/lib/strapi';
import Nav from "@/components/nav";
import Footer from "@/components/Footer";
import Links from "@/components/sections/Links";
import Guides from "@/components/sections/Guides"; 

export default async function SupportPage() {
const pageData = await fetchSingleType('support-page', {
    // Swap the flat array for an object to control deep population
    populate: {
      header: {
      populate: {
        logo: true,          // ← This is the correct way for media inside a component
      }
    },
      hero: '*',   // Populates all first-level fields in your hero component
      footer: '*',  // Populates all first-level fields in your footer component
      links: '*',  // Populates all first-level fields in your links component
      guides: '*',
    }
  });

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
        <Links links={pageData.links} />
      </div>
            <section className="section">
        <h2 className="section-title">Useful Guides</h2>
        <div className="guides-grid">
          <Guides guides={pageData.guides} />
        </div>
        </section>

      
    </main>
    <Footer content = {pageData?.footer?.content} />
   </>
  );
}
