/* Jakub Rumanovský — personal site
   Small progressive enhancements. Everything degrades to a working
   page if this file never loads. */

(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var timeline = document.querySelector(".timeline");

  var reduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- current year in the footer ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- solid header once scrolled past the hero band ---- */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile menu ---- */
  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---- highlight the section you are looking at ---- */
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---- the timeline line draws itself in as you scroll past it ---- */
  function updateProgress() {
    if (!timeline) return;

    if (reduced) {
      timeline.style.setProperty("--tl-progress", "100%");
      return;
    }

    var rect = timeline.getBoundingClientRect();
    if (!rect.height) return;

    // the "read line" sits a little below the middle of the viewport
    var readLine = window.innerHeight * 0.55;
    var pct = (readLine - rect.top) / rect.height;
    pct = Math.max(0, Math.min(1, pct));

    timeline.style.setProperty("--tl-progress", (pct * 100).toFixed(2) + "%");
  }

  if (timeline) {
    var ticking = false;
    var queueProgress = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateProgress();
        ticking = false;
      });
    };

    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress);
    window.addEventListener("load", updateProgress);
    updateProgress();
  }

  /* ---- fold the pre-2018 roles away until asked for ----
     They start visible in the HTML, so without JS the full history shows.
     Where the browser supports it we hide them as "until-found", which keeps
     Ctrl+F able to reach them and pops them open on a match. */
  var early = timeline ? timeline.querySelectorAll(".tl-early") : [];

  if (timeline && early.length) {
    var untilFound = "onbeforematch" in document.body;
    var isOpen = false;

    var moreBtn = document.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "tl-more";

    var setOpen = function (open) {
      isOpen = open;

      Array.prototype.forEach.call(early, function (li) {
        if (open) li.hidden = false;
        else li.hidden = untilFound ? "until-found" : true;
      });

      moreBtn.setAttribute("aria-expanded", String(open));
      moreBtn.innerHTML =
        '<span class="tl-more-ico" aria-hidden="true"></span>' +
        (open ? "Show fewer roles" : "Show " + early.length + " earlier roles");

      updateProgress();
    };

    moreBtn.addEventListener("click", function () {
      setOpen(!isOpen);
      if (!isOpen) moreBtn.scrollIntoView({ block: "nearest" });
    });

    // find-in-page reached a collapsed role — open the whole group so the
    // button label and the rest of the group stay consistent
    Array.prototype.forEach.call(early, function (li) {
      li.addEventListener("beforematch", function () { setOpen(true); });
    });

    timeline.parentNode.insertBefore(moreBtn, timeline.nextSibling);
    setOpen(false);
  }

  /* ---- fade sections in as they arrive (skipped if JS or IO is absent,
          and skipped for anyone who asked for reduced motion) ---- */
  if ("IntersectionObserver" in window && !reduced) {
    var blocks = document.querySelectorAll(".section .wrap > *, .contact-inner > *");

    var reveal = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    Array.prototype.forEach.call(blocks, function (block) {
      block.classList.add("reveal");
      reveal.observe(block);
    });
  }

  /* ---- a little something for anyone in devtools ---- */
  console.log(
    "%cNice of you to check.",
    "font: bold 14px/1.4 Inter, sans-serif; color:#0f2d52;"
  );
  console.log(
    "%c✓ 0 console errors   ✓ hand-written HTML/CSS/JS   ✓ no emoji were harmed",
    "font: 12px/1.6 monospace; color:#64748b;"
  );

  /* ---- konami code: ↑ ↑ ↓ ↓ ← → ← → B A ----
     A small reward for testers who still remember it. */
  var KONAMI = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  var konamiPos = 0;

  function showEasterToast() {
    var toast = document.createElement("div");
    toast.className = "easter-toast";
    toast.setAttribute("role", "status");
    toast.textContent = "Edge case found. That’s the job.";
    document.body.appendChild(toast);

    window.requestAnimationFrame(function () {
      toast.classList.add("show");
    });

    window.setTimeout(function () {
      toast.classList.remove("show");
      window.setTimeout(function () { toast.remove(); }, 300);
    }, 3200);
  }

  document.addEventListener("keydown", function (e) {
    var expected = KONAMI[konamiPos];
    var matched = e.key === expected ||
      (expected.length === 1 && e.key.toLowerCase() === expected);

    if (matched) {
      konamiPos++;
      if (konamiPos === KONAMI.length) {
        konamiPos = 0;
        showEasterToast();
      }
    } else {
      konamiPos = (e.key === KONAMI[0]) ? 1 : 0;
    }
  });
})();
