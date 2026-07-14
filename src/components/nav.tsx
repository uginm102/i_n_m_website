'use client';

export default function Nav() {
  return (
    <nav className="nav">
      <a href="index.html" className="logo-img">
        <img
          src="images/im-logo.png"
          alt="I&M Logo"
          style={{ height: "50px", width: "auto", marginTop: "5px" }}
        />
      </a>
      <div className="nav-right">
        <a href="#" className="nav-link">Guides <i className ="ti ti-chevron-down" aria-hidden="true"></i></a>
      </div>
    </nav>
  );
}


