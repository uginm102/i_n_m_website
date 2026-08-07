// components/sections/MobileAppDownload.tsx
type Props = {
  title: string;
  infoText?: string;
  appStoreUrl: string;
  appStorePrefix: string;
  appStoreLabel: string;
  playStoreUrl: string;
  playStorePrefix: string;
  playStoreLabel: string;
};

export default function MobileAppDownload({
  title,
  infoText,
  appStoreUrl,
  appStorePrefix,
  appStoreLabel,
  playStoreUrl,
  playStorePrefix,
  playStoreLabel,
}: Props) {
  return (
    <div className="footer-cta">
      <p>{title}</p>

      <div className="buttons-wrapper">
        {/* App Store */}
        <a
          href={appStoreUrl}
          className="store-button appstore-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${appStorePrefix} ${appStoreLabel}`}
        >
          <div className="apple-icon" aria-hidden="true"></div>
          <div className="btn-text">
            <span className="small-line">{appStorePrefix}</span>
            <span className="main-line">{appStoreLabel}</span>
          </div>
        </a>

        {/* Google Play */}
        <a
          href={playStoreUrl}
          className="store-button googleplay-btn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${playStorePrefix} ${playStoreLabel}`}
        >
          <div className="google-icon" aria-hidden="true"></div>
          <div className="btn-text">
            <span className="small-line">{playStorePrefix}</span>
            <span className="main-line">{playStoreLabel}</span>
          </div>
        </a>
      </div>

      {infoText && (
        <>
          <hr />
          <div className="info-text">{infoText}</div>
        </>
      )}
    </div>
  );
}