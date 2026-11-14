(function () {
  var WA = "60390548307";

  // Menu mudah alih
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Tahun di footer
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Katalog: tapis ikut kategori
  var chips = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll(".item[data-cat]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      items.forEach(function (it) { it.hidden = !(f === "semua" || it.getAttribute("data-cat") === f); });
      if (history.replaceState) history.replaceState(null, "", f === "semua" ? location.pathname : "#" + f);
    });
  });
  if (chips.length && location.hash) {
    var pre = document.querySelector('[data-filter="' + location.hash.slice(1) + '"]');
    if (pre) pre.click();
  }

  // Projek: tapis ikut tahun + carian, kira jumlah
  var rows = document.querySelectorAll("#projectTable tbody tr");
  var yearBtns = document.querySelectorAll("[data-year]");
  var search = document.getElementById("projectSearch");
  var countEl = document.getElementById("rowCount");
  var totalEl = document.getElementById("rowTotal");
  var activeYear = "semua";
  function fmt(n) { return "RM " + n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function applyTable() {
    var q = search ? search.value.trim().toLowerCase() : "";
    var count = 0, total = 0;
    rows.forEach(function (r) {
      var okY = activeYear === "semua" || r.getAttribute("data-y") === activeYear;
      var okQ = !q || r.textContent.toLowerCase().indexOf(q) !== -1;
      r.hidden = !(okY && okQ);
      if (!r.hidden) { count++; total += parseFloat(r.getAttribute("data-amt")); }
    });
    if (countEl) countEl.textContent = count + " pesanan";
    if (totalEl) totalEl.textContent = fmt(total);
  }
  yearBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      activeYear = b.getAttribute("data-year");
      yearBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      applyTable();
    });
  });
  if (search) search.addEventListener("input", applyTable);
  if (rows.length) applyTable();

  // Lightbox galeri
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var shots = Array.prototype.slice.call(document.querySelectorAll(".photos button"));
    var idx = 0, lastFocus = null;
    function show(i) {
      idx = (i + shots.length) % shots.length;
      var im = shots[idx].querySelector("img");
      lbImg.src = im.src; lbImg.alt = im.alt;
    }
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    shots.forEach(function (s, i) {
      s.addEventListener("click", function () {
        lastFocus = s; show(i); lb.classList.add("open"); document.body.style.overflow = "hidden";
        lb.querySelector(".lb-close").focus();
      });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  // Borang: hantar melalui WhatsApp sebagai pilihan kedua
  var waBtn = document.getElementById("sendWhatsApp");
  var form = document.getElementById("quoteForm");
  if (waBtn && form) {
    waBtn.addEventListener("click", function () {
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var msg = "Salam, saya ingin mendapatkan sebut harga.\n\n" +
        "Nama: " + d.get("nama") + "\n" +
        "Organisasi: " + (d.get("organisasi") || "-") + "\n" +
        "Telefon: " + d.get("telefon") + "\n" +
        "E-mel: " + d.get("email") + "\n" +
        "Kategori: " + d.get("kategori") + "\n\n" + d.get("mesej");
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }

  // Isi kategori borang dari pautan katalog (?item=...)
  var params = new URLSearchParams(location.search);
  var itemParam = params.get("item");
  if (itemParam && form) {
    var ta = form.querySelector("textarea");
    if (ta && !ta.value) ta.value = "Saya berminat mendapatkan sebut harga untuk: " + itemParam + "\nKuantiti: \nTarikh diperlukan: ";
  }
})();
