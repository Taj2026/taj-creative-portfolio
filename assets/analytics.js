/* Google Analytics 4 — site-wide page-view tracking.
 *
 * SETUP: replace the placeholder below with your GA4 Measurement ID (looks like
 * "G-XXXXXXXXXX"). You get it from https://analytics.google.com after creating a
 * property + web data stream. Until a real ID is set, this file does nothing —
 * no Google script loads and no data is collected.
 */
(function () {
  var MEASUREMENT_ID = 'G-RE26PGL3WL'; // GA4 Measurement ID (tajcreative.com web stream)

  // Not configured yet (still the placeholder): do nothing.
  if (!MEASUREMENT_ID || MEASUREMENT_ID.indexOf('XXXX') !== -1) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);
})();
