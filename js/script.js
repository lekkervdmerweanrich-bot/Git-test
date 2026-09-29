(function () {
  "use strict";

  document.documentElement.classList.remove("js-disabled");
  document.documentElement.classList.add("js-enabled");

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     Sticky header: add a shadow once the page has scrolled
  --------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var setHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  /* ---------------------------------------------------------
     Scroll reveal: fade/rise sections and stamps into view
  --------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(".reveal, .stamp");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Stagger children inside .reveal-stagger containers */
  document.querySelectorAll(".reveal-stagger").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--i", i);
    });
  });

  /* ---------------------------------------------------------
     Parallax: the hero / promise discs drift as you scroll
  --------------------------------------------------------- */
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !prefersReducedMotion) {
    var ticking = false;

    var updateParallax = function () {
      var viewportH = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var rect = el.getBoundingClientRect();
        var centerOffset = rect.top + rect.height / 2 - viewportH / 2;
        var y = centerOffset * -speed;
        el.style.setProperty("--parallax-y", y.toFixed(1) + "px");
      });
      ticking = false;
    };

    var requestTick = function () {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    updateParallax();
  }

  /* ---------------------------------------------------------
     Sticky WhatsApp button: hide while the header's own
     WhatsApp button or the footer is on screen, to avoid
     stacking two identical calls to action
  --------------------------------------------------------- */
  var stickyWhatsapp = document.querySelector(".sticky-whatsapp");
  var contactSection = document.getElementById("contact");
  if (stickyWhatsapp && contactSection && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          stickyWhatsapp.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    ctaObserver.observe(contactSection);
  }

  /* ---------------------------------------------------------
     Contact form: build a pre-filled WhatsApp message.
     Static site, no backend — WhatsApp is the actual inbox.
  --------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = (document.getElementById("field-name") || {}).value || "";
      var suburb = (document.getElementById("field-suburb") || {}).value || "";
      var details = (document.getElementById("field-details") || {}).value || "";
      var fileInput = document.getElementById("field-photo");
      var hasPhoto = !!(fileInput && fileInput.files && fileInput.files.length);

      var lines = ["Hi Eco-Ox, I'd like a price."];
      if (name.trim()) lines.push("Name: " + name.trim());
      if (suburb.trim()) lines.push("Suburb: " + suburb.trim());
      if (details.trim()) lines.push("What needs to go: " + details.trim());
      if (hasPhoto) {
        lines.push(
          "(I have a photo ready to send here in WhatsApp.)"
        );
      }

      var message = encodeURIComponent(lines.join("\n"));
      var url = "https://wa.me/27832576768?text=" + message;
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------------------------------------------------------
     Current year in the footer
  --------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
