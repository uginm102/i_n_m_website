import Image from "next/image";
import "./page.module.css";

// app/[lang]/page.tsx
import HeroBanner from '@/components/sections/HeroBanner';
import { fetchSingleType } from '@/lib/strapi';
import Nav from "@/components/nav";
import Footer from "@/components/Footer";

export default async function SupportPage() {
  // 1. Fetch the data from Strapi (ensure the 'hero' component is populated)
  const pageData = await fetchSingleType('support-page', { populate: ['hero'] });
  const footerData = await fetchSingleType('footer');
// console.log('Fetched pageData:', pageData);
console.log('Fetched footerData:', footerData);
  if (!pageData) return null;

  return (
    <>
      <Nav />
       <main className="main-content">
      {/* 2. Map the Strapi data directly to the component's props */}
      <HeroBanner 
        title={pageData.hero.title} 
        searchPlaceholder={pageData.hero.searchPlaceholder} 
        searchButtonText={pageData.hero.searchButtonText} 
      />
      
      {/* ... Other sections like QuickLinks, GuidesGrid ... */}
    </main>
    <Footer content = {footerData.content} />
   </>
  );
}
