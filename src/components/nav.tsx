'use client';

export default function Nav({header}: {header: any}) {
  return (
    <nav className="nav">
      <a href="index.html" className="logo-img">
        <img
          src={process.env.NEXT_PUBLIC_STRAPI_API_URL + header.logo.url}
          alt="I&M Logo"
          style={{ height: "50px", width: "auto", marginTop: "5px" }}
        />
      </a>
    </nav>
  );
}


