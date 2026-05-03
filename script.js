/* =========================================================
   AESTHETIC INDIA — script.js v3
   Mobile nav · Scroll reveal · FAQ accordion · Lead form
   ========================================================= */
(function(){
  "use strict";

  /* ── Mobile nav ─────────────────────────────────────── */
  var hamburger = document.querySelector(".hamburger");
  var mobileNav = document.querySelector(".mobile-nav");
  if(hamburger && mobileNav){
    hamburger.addEventListener("click", function(){
      var open = mobileNav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        mobileNav.classList.remove("open");
        hamburger.setAttribute("aria-expanded","false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ── Scroll reveal (IntersectionObserver) ───────────── */
  var revealEls = document.querySelectorAll(".reveal");
  if(revealEls.length && "IntersectionObserver" in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, {threshold: 0.10});
    revealEls.forEach(function(el){ obs.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("visible"); });
  }

  /* ── FAQ Accordion ──────────────────────────────────── */
  document.querySelectorAll(".faq-q").forEach(function(btn){
    btn.addEventListener("click", function(){
      var ans = btn.nextElementSibling;
      var isOpen = btn.classList.contains("open");
      // close all open
      document.querySelectorAll(".faq-q.open").forEach(function(b){
        b.classList.remove("open");
        var icon = b.querySelector(".faq-icon");
        if(icon) icon.textContent = "+";
        var a = b.nextElementSibling;
        if(a) a.classList.remove("open");
      });
      if(!isOpen){
        btn.classList.add("open");
        var icon = btn.querySelector(".faq-icon");
        if(icon) icon.textContent = "×";
        if(ans) ans.classList.add("open");
      }
    });
  });

  /* ── Lead capture form ──────────────────────────────── */
  var form = document.getElementById("leadForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var btn  = form.querySelector(".form-submit");
      var succ = document.getElementById("formSuccess");
      var nameEl    = form.querySelector('[name="name"]');
      var phoneEl   = form.querySelector('[name="phone"]');
      var productEl = form.querySelector('[name="product"]');
      var name    = nameEl  ? nameEl.value.trim()    : "";
      var phone   = phoneEl ? phoneEl.value.trim()   : "";
      var product = productEl ? productEl.value      : "your products";
      if(!name || !phone){
        alert("Please enter your name and phone number.");
        return;
      }
      btn.textContent = "Sending…";
      btn.disabled = true;
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {"Accept": "application/json"}
      })
      .then(function(r){
        if(succ) succ.style.display = "block";
        form.reset();
        var msg = encodeURIComponent(
          "Hello Aesthetic India, I have submitted an enquiry. My name is " +
          name + ". I am interested in " + product + ". Please contact me on " + phone + "."
        );
        setTimeout(function(){
          window.open("https://api.whatsapp.com/send?phone=919711542223&text=" + msg, "_blank");
        }, 700);
      })
      .catch(function(){
        if(succ) succ.style.display = "block";
        form.reset();
        var msg = encodeURIComponent(
          "Hello Aesthetic India, my name is " + name +
          ". I am interested in " + product + ". My phone: " + phone + "."
        );
        window.open("https://api.whatsapp.com/send?phone=919711542223&text=" + msg, "_blank");
      })
      .finally(function(){
        btn.textContent = "Send Enquiry →";
        btn.disabled = false;
      });
    });
  }

  /* ── Header scroll shadow ───────────────────────────── */
  var header = document.querySelector("header");
  if(header){
    window.addEventListener("scroll", function(){
      header.style.boxShadow = window.scrollY > 10
        ? "0 4px 24px rgba(0,0,0,.75)"
        : "none";
    }, {passive: true});
  }

})();
