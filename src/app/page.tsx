import Image from "next/image";
import "./page.module.css";

// app/[lang]/page.tsx
import HeroBanner from '@/components/sections/HeroBanner';
import { fetchSingleType } from '@/lib/strapi';
import Nav from "@/components/nav";
import Footer from "@/components/Footer";

export default async function SupportPage() {
const pageData = await fetchSingleType('support-page', {
    // Swap the flat array for an object to control deep population
    populate: {
      header: {
        populate: ['logo'] // Forces Strapi to look inside header and pull the logo media data
      },
      hero: '*',   // Populates all first-level fields in your hero component
      footer: '*'  // Populates all first-level fields in your footer component
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
      
      {/* ... Other sections like QuickLinks, GuidesGrid ... */}
    </main>
    <Footer content = {pageData.footer.content} />
   </>
  );
}
