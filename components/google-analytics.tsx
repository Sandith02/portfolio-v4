import Script from "next/script";

const measurementId = "G-0DX5RCBC2Q";

export function GoogleAnalytics() {
  return <>
    <Script id="google-analytics-init" strategy="lazyOnload">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    `}</Script>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="lazyOnload" />
  </>;
}
