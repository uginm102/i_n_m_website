// components/TopicCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type ServiceLink = {
  label: string;
  url?: string;
  slug?: string;
};

type Props = {
  title: string;
  description: string;
  iconClass?: string;
  links?: ServiceLink[];
  slug?: string;
  defaultOpen?: boolean;
  lang?: string; // Optional lang prop for future use
};

export default function TopicCard({
  title,
  description,
  iconClass,
  links = [],
  slug,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  console.log("TopicCard props:", { title, description, iconClass, links, slug, defaultOpen }); // Debugging line to check the props

  return (
    <div className="topic-card">
      <button
        className="topic-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="topic-left">
          <div className="topic-icon-box">
            <i className={iconClass || "ti ti-help"} aria-hidden="true"></i>
          </div>
          <div>
            <div className="topic-name">{title}</div>
            <div className="topic-sub">{description}</div>
          </div>
        </div>
        <i
          className={`ti ti-chevron-down chevron ${isOpen ? "open" : ""}`}
          aria-hidden="true"
        ></i>
      </button>

      <div className={`topic-body ${isOpen ? "open" : ""}`}>
        <ul className="topic-links">
          {links.map((link, index) => (
            
            <li key={index}>
              <Link href={slug ? `/en/services/${slug}/${link?.slug}` : `#${link?.slug}`}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
