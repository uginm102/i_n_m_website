import { fetchSingleType, getServiceBySlug } from "@/lib/strapi";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TopicCard from "@/components/sections/TopicCard";
import Link from "next/link";

type Props = {
  params: Promise<{ lang: string; category: string }>;
};

export default async function ServicesPage({ params }: Props) {
    console.log("Fetching service page data from Strapi...");
  const { lang, category } = await params;
  console.log("Params:", { lang, category });

  const service = await getServiceBySlug(category);

  if (!service) {
    return <div>Service not found</div>;
  }

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
        <span className="breadcrumb-current">{service.title}</span>
      </div>

      <div className="page-layout">
        <main className="page-main">
          <h1 className="page-heading">{service.title}</h1>

          {/* Dynamic Topic Cards */}
           {service.service?.map((item: any, index: number) => (
            <TopicCard
              key={item.id || index}
              title={item.title}
              description={item.description}
              iconClass={item.iconClass}
              links={item.services || []}
              defaultOpen={index === 0} // first one open by default
            />
          ))}
        </main>

        {/* Aside */}
        <aside className="page-aside">
          <div className="aside-card">
            <h3 className="aside-heading">Popular Articles</h3>
            <ul className="aside-links">
              <li>
                <a href="#">
                  <i className="ti ti-arrow-right" aria-hidden="true"></i>
                  Mobile Money
                </a>
              </li>
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
              <i className="ti ti-headset" aria-hidden="true"></i> Contact
              Support
            </a>
          </div>
        </aside>
      </div>

      <Footer content={pageData?.footer?.content} />
    </>
  );
}
