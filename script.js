/* =========================================================
   AESTHETIC INDIA — script.js
   IntersectionObserver-based reveals, mobile nav, form
   ========================================================= */

(function () {
  "use strict";

  /* ── Mobile nav ─────────────────────────────────────── */
  var hamburger = document.querySelector(".hamburger");
  var mobileNav = document.querySelector(".mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ── Scroll reveal (IntersectionObserver) ───────────── */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ── Lead capture form ──────────────────────────────── */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn   = form.querySelector(".form-submit");
      var succ  = document.getElementById("formSuccess");
      var data  = {
        name:    form.querySelector('[name="name"]').value.trim(),
        phone:   form.querySelector('[name="phone"]').value.trim(),
        email:   form.querySelector('[name="email"]').value.trim(),
        product: form.querySelector('[name="product"]').value,
        message: form.querySelector('[name="message"]').value.trim()
      };

      /* Basic validation */
      if (!data.name || !data.phone) {
        alert("Please enter your name and phone number.");
        return;
      }

      btn.textContent = "Sending…";
      btn.disabled = true;

      /* Send via FormSubmit (no backend needed — change action below) */
      var fd = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: fd,
        headers: { "Accept": "application/json" }
      })
      .then(function (r) {
        if (r.ok) {
          if (succ) { succ.style.display = "block"; }
          form.reset();
          /* Auto-open WhatsApp after form submit for double-touch */
          setTimeout(function () {
            var msg = encodeURIComponent(
              "Hello Aesthetic India, I have submitted an enquiry. My name is " +
              data.name + ". I am interested in " + (data.product || "your products") + "."
            );
            window.open("https://api.whatsapp.com/send?phone=919711542223&text=" + msg, "_blank");
          }, 800);
        } else {
          alert("Something went wrong. Please call us directly.");
        }
      })
      .catch(function () {
        /* Fallback: open WhatsApp directly */
        var msg = encodeURIComponent(
          "Hello Aesthetic India, my name is " + data.name +
          ". I am interested in " + (data.product || "your products") + ". Phone: " + data.phone
        );
        window.open("https://api.whatsapp.com/send?phone=919711542223&text=" + msg, "_blank");
        if (succ) { succ.style.display = "block"; }
        form.reset();
      })
      .finally(function () {
        btn.textContent = "Send Enquiry →";
        btn.disabled = false;
      });
    });
  }

  /* ── Header scroll shadow ───────────────────────────── */
  var header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.style.boxShadow = window.scrollY > 10
        ? "0 4px 24px rgba(0,0,0,0.7)"
        : "none";
    }, { passive: true });
  }

})();
