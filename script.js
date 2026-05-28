/* =========================================================
   AESTHETIC INDIA — script.js v4
   Mobile nav · Scroll reveal · FAQ accordion · Lead form
   Header scroll · Auto sale-date manager
   ========================================================= */
(function () {
  "use strict";

  /* ── Mobile nav ─────────────────────────────────────── */
  var hamburger = document.querySelector(".hamburger");
  var mobileNav = document.querySelector(".mobile-nav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ── Scroll reveal ──────────────────────────────────── */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.10 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ── FAQ Accordion ──────────────────────────────────── */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var ans = btn.nextElementSibling;
      var isOpen = btn.classList.contains("open");
      /* close all */
      document.querySelectorAll(".faq-q.open").forEach(function (b) {
        b.classList.remove("open");
        var icon = b.querySelector(".faq-icon");
        if (icon) icon.textContent = "+";
        var a = b.nextElementSibling;
        if (a) { a.classList.remove("open"); a.style.maxHeight = null; }
      });
      /* open current */
      if (!isOpen) {
        btn.classList.add("open");
        var icon = btn.querySelector(".faq-icon");
        if (icon) icon.textContent = "×";
        if (ans) { ans.classList.add("open"); ans.style.maxHeight = ans.scrollHeight + "px"; }
      }
    });
  });

  /* ── Lead capture form ──────────────────────────────── */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector(".form-submit");
      var succ = document.getElementById("formSuccess");
      var nameEl = form.querySelector('[name="name"]');
      var phoneEl = form.querySelector('[name="phone"]');
      var productEl = form.querySelector('[name="product"]');
      var name = nameEl ? nameEl.value.trim() : "";
      var phone = phoneEl ? phoneEl.value.trim() : "";
      var product = productEl ? productEl.value : "your products";
      if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
      }
      /* Basic phone validation */
      if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) {
        alert("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
      btn.textContent = "Sending…";
      btn.disabled = true;
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
        .then(function () {
          if (succ) succ.style.display = "block";
          form.reset();
          var msg = encodeURIComponent(
            "Hello Aesthetic India, I have submitted an enquiry. My name is " +
            name + ". I am interested in " + product + ". Please contact me on " + phone + "."
          );
          setTimeout(function () {
            window.open("https://api.whatsapp.com/send?phone=919711542223&text=" + msg, "_blank");
          }, 700);
        })
        .catch(function () {
          if (succ) succ.style.display = "block";
          form.reset();
          var msg = encodeURIComponent(
            "Hello Aesthetic India, my name is " + name +
            ". I am interested in " + product + ". My phone: " + phone + "."
          );
          window.open("https://api.whatsapp.com/send?phone=919711542223&text=" + msg, "_blank");
        })
        .finally(function () {
          btn.textContent = "Send Enquiry →";
          btn.disabled = false;
        });
    });
  }

  /* ── Header scroll shadow ───────────────────────────── */
  var hdr = document.querySelector("header");
  if (hdr) {
    window.addEventListener("scroll", function () {
      hdr.style.boxShadow = window.scrollY > 10 ? "0 4px 24px rgba(0,0,0,.75)" : "none";
    }, { passive: true });
  }

  /* ============================================================
     SALE DATE AUTO-MANAGER
     ============================================================
     HOW TO USE:
       1. Set SALE_END_DAY to the last day of your sale (1–28).
          Month and year auto-roll — you never update them manually.
       2. Edit OFFER_TEXTS to change what appears on expiry.
       3. Deploy once. Done.
     ============================================================ */
  (function () {

    /* ── CONFIG — only edit this block ── */
    var SALE_END_DAY = 30;   /* ← last calendar day of the sale period */

    var OFFER_TEXTS = {
      stripActive:    "LIMITED TIME: Special Institution Pricing — Up to 20% Off on Bulk Orders",
      stripExpired:   "Best Price Guaranteed — Free On-Site Demo Available Across India",
      pillActive:     "🎁 Free Installation + Teacher Training + 1-Year AMC on Orders This Month",
      pillExpired:    "🎁 Free On-Site Demo + Installation Support on All Confirmed Orders",
      cardHeading:    "Limited Time Offer",
      cardHeadingExp: "Our Current Offer",
      cardBodyActive: [
        "Free wall mounting and professional installation",
        "Free teacher training — 2 dedicated sessions",
        "Free 1-year AMC (worth ₹8,000–₹15,000)",
        "Up to 20% off on orders of 5 or more panels"
      ],
      cardBodyExpired: [
        "Free on-site demo at your institution",
        "Free installation and commissioning",
        "Best bulk pricing for schools and institutions",
        "Free technical consultation and site survey"
      ]
    };
    /* ── END CONFIG ── */

    var MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];

    function getSaleDeadline() {
      var now  = new Date();
      var y    = now.getFullYear();
      var m    = now.getMonth();
      var d    = new Date(y, m, SALE_END_DAY, 23, 59, 59);
      if (now > d) d = new Date(y, m + 1, SALE_END_DAY, 23, 59, 59);
      return d;
    }

    function formatDate(d) {
      var day = d.getDate();
      var sfx = (day===1||day===21||day===31) ? "st"
              : (day===2||day===22)            ? "nd"
              : (day===3||day===23)            ? "rd" : "th";
      return day + sfx + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
    }

    function daysLeft(d) {
      return Math.ceil((d - new Date()) / 86400000);
    }

    function countdown(days) {
      if (days <= 0)  return "";
      if (days === 1) return " — <strong style='color:#d4af37'>Last day!</strong>";
      if (days <= 5)  return " — <strong style='color:#d4af37'>Only " + days + " days left!</strong>";
      if (days <= 10) return " — Offer ends in <strong style='color:#d4af37'>" + days + " days</strong>";
      return "";
    }

    function buildCardBody(lines, deadline) {
      return "Order before <strong style='color:#d4af37'>" + formatDate(deadline) +
        "</strong> and get:<br>" + lines.map(function(l){ return "✅ " + l; }).join("<br>");
    }

    var deadline = getSaleDeadline();
    var active   = new Date() <= deadline;
    var days     = daysLeft(deadline);

    /* 1 — Offer strip */
    var stripText = document.getElementById("offer-strip-text");
    if (stripText) {
      stripText.innerHTML = (active ? OFFER_TEXTS.stripActive : OFFER_TEXTS.stripExpired)
        + (active ? countdown(days) : "");
    }

    /* 2 — Pill in CTA section */
    var pill = document.getElementById("offer-pill-text");
    if (pill) pill.textContent = active ? OFFER_TEXTS.pillActive : OFFER_TEXTS.pillExpired;

    /* 3 — CTA urgency text */
    var urgency = document.getElementById("cta-urgency-text");
    if (urgency) {
      urgency.textContent = active
        ? (days <= 3 ? "Last " + days + " Day" + (days > 1 ? "s" : "") + "!" : "Today Only")
        : "Best Price Guaranteed";
    }

    /* 4 — Inline offer card heading */
    var cardH = document.getElementById("offer-card-heading");
    if (cardH) cardH.textContent = active ? OFFER_TEXTS.cardHeading : OFFER_TEXTS.cardHeadingExp;

    /* 5 — Inline offer card body */
    var cardB = document.getElementById("offer-card-body");
    if (cardB) {
      cardB.innerHTML = active
        ? buildCardBody(OFFER_TEXTS.cardBodyActive, deadline)
        : buildCardBody(OFFER_TEXTS.cardBodyExpired, deadline);
    }

    /* 6 — WhatsApp link in offer card — update month reference */
    var cardBtn = document.getElementById("offer-card-btn");
    if (cardBtn) {
      var mo = MONTHS[deadline.getMonth()];
      cardBtn.setAttribute("href",
        "https://api.whatsapp.com/send?phone=919711542223&text=Hello%20Aesthetic%20India%2C%20I%20want%20to%20claim%20the%20" +
        encodeURIComponent(mo) + "%20" + deadline.getFullYear() +
        "%20offer%20on%20Interactive%20Flat%20Panels."
      );
    }

    /* 7 — Any standalone deadline span elements [data-sale-date] */
    document.querySelectorAll("[data-sale-date]").forEach(function(el) {
      el.textContent = formatDate(deadline);
    });

  })();

})();
