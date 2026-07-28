import { fetchSingleType, getServiceBySlug } from "@/lib/strapi";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

type Props = {
  params: Promise<{ lang: string; category: string }>;
};

export default async function ServicePage({ params }: Props) {
  const { lang, category } = await params;
  console.log("Params:", { lang, category });


  const pageData = await fetchSingleType("support-page", {
    // Swap the flat array for an object to control deep population
    populate: {
      header: {
        populate: {
          logo: true, // ← This is the correct way for media inside a component
        },
      },
      footer: "*", // Populates all first-level fields in your footer component
    },
  });

  if (!pageData) return <div>Failed to load data.</div>;

  return (
    <>
      <Nav header={pageData.header} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <Link href={`/${lang}`} className="breadcrumb-link">
          Help
        </Link>
        <i
          className="ti ti-chevron-right breadcrumb-sep"
          aria-hidden="true"
        ></i>
        {/* <span className="breadcrumb-current">{service.title}</span> */}
      </div>

     

      <Footer content={pageData?.footer?.content} />
    </>
  );
}
