// Google Analytics 4
// Gantikan G-XXXXXXXXXX dengan Measurement ID anda (Google Analytics > Admin > Data Streams).
// Selagi ID belum ditukar, skrip ini tidak memuatkan apa-apa.
(function () {
  var GA_ID = "G-XXXXXXXXXX";
  if (!GA_ID || GA_ID.indexOf("XXXX") !== -1) return;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
  // Jejak klik WhatsApp sebagai event
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (a) gtag("event", "whatsapp_click", { link_url: a.href, page_path: location.pathname });
  });
})();
