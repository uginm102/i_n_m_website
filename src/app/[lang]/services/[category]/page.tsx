import {
  fetchSingleType,
  getServiceBySlug,
  Service,
  type SupportPage,
} from "@/lib/strapi";
import Nav from "@/components/Nav";
import PopularArticles from "@/components/PopularArticles";
import Footer from "@/components/Footer";
import TopicCard from "@/components/sections/TopicCard";
import Link from "next/link";

type Props = {
  params: Promise<{ lang: string; category: string }>;
};

export default async function ServicesPage({ params }: Props) {
  const { lang, category } = await params;

  const service = await getServiceBySlug(category, lang);

  const pageData = await fetchSingleType<SupportPage>("support-page", {
    // Swap the flat array for an object to control deep population
    populate: {
      header: {
        populate: {
          logo: true, // ← This is the correct way for media inside a component
        },
      },
      footer: "*", // Populates all first-level fields in your footer component
    },
    locale: lang,
  });

  if (!service) {
    return (
      <>
        <Nav header={pageData?.header} lang={lang} />

        <div className="page-layout">
          <main className="page-main">
            <div className="not-available">
              <div className="not-available-card">
                <i
                  className="ti ti-language-off"
                  style={{ fontSize: 36, marginBottom: 16 }}
                ></i>
                <h1>Content not available</h1>
                <p>This service is not available in this language yet.</p>

                <Link href={`/${lang}`} className="back-link">
                  ← Back to support page
                </Link>
              </div>
            </div>
          </main>
        </div>

        <Footer content={pageData?.footer?.content ?? ""} />
      </>
    );
  }
  if (!pageData) return <div>Failed to load data.</div>;

  return (
    <>
      <Nav header={pageData?.header} lang={lang} />

      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <Link href={`/${lang}`} className="breadcrumb-link">
          Help
        </Link>
        <i
          className="ti ti-chevron-right breadcrumb-sep"
          aria-hidden="true"
        ></i>
        <span className="breadcrumb-current">{service?.title}</span>
      </div>

      <div className="page-layout">
        <main className="page-main">
          {service?.service && service.service.length > 0 ? (
            <>
              <h1 className="page-heading">{service.title}</h1>

              {service.service.map((item: Service, index: number) => (
                <TopicCard
                  key={item.id || index}
                  title={item.title}
                  description={item.description}
                  iconClass={item.iconClass}
                  slug={service.slug}
                  links={item.services || []}
                  lang={lang}
                  defaultOpen={index === 0}
                />
              ))}
            </>
          ) : (
            <div className="no-services">
              <div className="no-services-card">
                <i
                  className="ti ti-folder-off"
                  style={{ fontSize: 32, marginBottom: 12 }}
                ></i>
                <p>No services available for this category.</p>
              </div>
            </div>
          )}
        </main>
        {/* Aside */}
        <PopularArticles lang={lang} />
      </div>

      <Footer content={pageData?.footer?.content ?? ""} />
    </>
  );
}
