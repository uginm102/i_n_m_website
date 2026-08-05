// components/sections/ServiceGuide.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Step = {
  order?: number;
  title: string;
  description: string;
  screenshot?: {
    url: string;
    alternativeText?: string;
  };
};

type Props = {
  title: string;
  shortDescription?: string;
  steps: Step[];
};

export default function ServiceGuide({
  title,
  shortDescription,
  steps,
}: Props) {
  // Sort steps by order
  const sortedSteps = [...steps].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  const [currentStep, setCurrentStep] = useState(0);
  const total = sortedSteps.length;

  const goToStep = (index: number) => {
    if (index < 0 || index >= total) return;
    setCurrentStep(index);
  };

  const nextStep = () => goToStep((currentStep + 1) % total);
  const prevStep = () => goToStep((currentStep - 1 + total) % total);

  // Scroll spy
  useEffect(() => {
    const onScroll = () => {
      const items = document.querySelectorAll(".step-item");
      const windowMid = window.scrollY + window.innerHeight * 0.42;
      let best = 0;
      let bestDist = Infinity;

      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const mid = window.scrollY + rect.top + rect.height / 2;
        const dist = Math.abs(mid - windowMid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      if (best !== currentStep) {
        setCurrentStep(best);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentStep]);

  const currentScreenshot = sortedSteps[currentStep]?.screenshot;

  return (
    <>
      <h1 className="page-heading">{title}</h1>

      {shortDescription && <p className="article-intro">{shortDescription}</p>}

      <div className="article-grid">
        {/* ── PHONE CAROUSEL ── */}
        <div className="carousel-col">
          <div className="carousel-wrapper">
            <button
              className="nav-arrow"
              onClick={prevStep}
              aria-label="Previous step"
            >
              ‹
            </button>

            <div className="phone-frame">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                {currentScreenshot ? (
                  <div className="slide active">
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_STRAPI_API_URL +
                        currentScreenshot.url
                      }
                      alt={
                        currentScreenshot.alternativeText ||
                        `Step ${currentStep + 1}`
                      }
                      width={280}
                      height={560}
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  </div>
                ) : (
                  <div className="slide active">
                    <div
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#999",
                      }}
                    >
                      No image
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="nav-arrow"
              onClick={nextStep}
              aria-label="Next step"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="carousel-dots">
            {sortedSteps.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentStep ? "active" : ""}`}
                onClick={() => goToStep(index)}
                aria-label={`Step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── STEPS LIST ── */}
        <div className="steps-list">
          {sortedSteps.map((step, index) => (
            <div
              key={index}
              className={`step-item ${index === currentStep ? "active" : ""}`}
              onClick={() => goToStep(index)}
            >
              <div className="step-num">{step.order ?? index + 1}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
