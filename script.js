/*
  MARS — homepage interactions
  Vanilla JavaScript implementation for the Wix template 3301 rebuild.

  Includes:
  - full-screen navigation with focus management
  - hero video play/pause control
  - scroll reveal motion
  - subtle parallax movement
  - testimonial slider with autoplay, keyboard, and swipe controls
  - seamless client-mark marquee preparation
  - newsletter and contact form validation with email handoff
  - current-year updates
*/

(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const prefersReducedMotion = () => reduceMotionQuery.matches;

  const on = (element, eventName, handler, options) => {
    if (element) {
      element.addEventListener(eventName, handler, options);
    }
  };

  const getFocusableElements = (container) => {
    if (!container) return [];

    return Array.from(
      container.querySelectorAll(
        [
          "a[href]",
          "button:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          "[tabindex]:not([tabindex='-1'])",
        ].join(",")
      )
    ).filter((element) => {
      const style = window.getComputedStyle(element);
      return style.visibility !== "hidden" && style.display !== "none";
    });
  };

  const padNumber = (value) => String(value).padStart(2, "0");

  root.classList.add("js");

  /* ------------------------------------------------------------------
     Full-screen navigation
  ------------------------------------------------------------------ */
  const setupMenu = () => {
    const menu = doc.querySelector("[data-site-menu]");
    const openButtons = Array.from(doc.querySelectorAll("[data-menu-open]"));
    const closeButtons = Array.from(doc.querySelectorAll("[data-menu-close]"));

    if (!menu || openButtons.length === 0) return;

    const panel = menu.querySelector(".site-menu__panel");
    const backdrop = menu.querySelector(".site-menu__backdrop");
    let previouslyFocused = null;
    let closingAnimation = null;

    const setExpanded = (expanded) => {
      openButtons.forEach((button) => {
        button.setAttribute("aria-expanded", String(expanded));
      });
    };

    const focusFirstMenuItem = () => {
      const focusable = getFocusableElements(panel);
      const preferredTarget = panel?.querySelector("[data-menu-close]") || focusable[0];
      preferredTarget?.focus({ preventScroll: true });
    };

    const openMenu = (trigger) => {
      if (menu.getAttribute("aria-hidden") === "false") return;

      closingAnimation?.cancel();
      previouslyFocused = trigger || doc.activeElement;
      menu.getAnimations().forEach((animation) => animation.cancel());
      panel?.getAnimations().forEach((animation) => animation.cancel());
      backdrop?.getAnimations().forEach((animation) => animation.cancel());

      menu.setAttribute("aria-hidden", "false");
      setExpanded(true);
      body.classList.add("menu-is-open");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(focusFirstMenuItem);
      });
    };

    const finishClose = () => {
      menu.setAttribute("aria-hidden", "true");
      setExpanded(false);
      body.classList.remove("menu-is-open");

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };

    const closeMenu = () => {
      if (menu.getAttribute("aria-hidden") !== "false") return;

      if (prefersReducedMotion() || !panel?.animate || !backdrop?.animate) {
        finishClose();
        return;
      }

      const panelAnimation = panel.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(100%)" },
        ],
        {
          duration: 470,
          easing: "cubic-bezier(0.76, 0, 0.24, 1)",
          fill: "forwards",
        }
      );

      backdrop.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        {
          duration: 330,
          easing: "ease",
          fill: "forwards",
        }
      );

      closingAnimation = panelAnimation;
      panelAnimation.finished.then(finishClose).catch(() => {});
    };

    const trapFocus = (event) => {
      if (event.key !== "Tab" || menu.getAttribute("aria-hidden") !== "false") {
        return;
      }

      const focusable = getFocusableElements(panel);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    openButtons.forEach((button) => {
      on(button, "click", () => openMenu(button));
    });

    closeButtons.forEach((button) => {
      on(button, "click", closeMenu);
    });

    on(doc, "keydown", (event) => {
      if (event.key === "Escape" && menu.getAttribute("aria-hidden") === "false") {
        event.preventDefault();
        closeMenu();
        return;
      }

      trapFocus(event);
    });

    on(menu, "click", (event) => {
      const link = event.target.closest(".overlay-nav a");
      if (link) closeMenu();
    });
  };

  /* ------------------------------------------------------------------
     Hero video control
  ------------------------------------------------------------------ */
  const setupVideoPlayer = () => {
    const player = doc.querySelector("[data-video-player]");
    const video = player?.querySelector("video");
    const toggle = player?.querySelector("[data-video-toggle]");

    if (!video || !toggle) return;

    const updateButton = () => {
      const paused = video.paused;
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.setAttribute(
        "aria-label",
        paused ? "Play decorative video" : "Pause decorative video"
      );
    };

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Browser autoplay policies may require an explicit user gesture.
      }
      updateButton();
    };

    const pauseVideo = () => {
      video.pause();
      updateButton();
    };

    on(toggle, "click", () => {
      if (video.paused) {
        playVideo();
      } else {
        pauseVideo();
      }
    });

    on(video, "play", updateButton);
    on(video, "pause", updateButton);
    on(video, "ended", updateButton);

    on(doc, "visibilitychange", () => {
      if (doc.hidden && !video.paused) {
        video.dataset.resumeWhenVisible = "true";
        pauseVideo();
      } else if (!doc.hidden && video.dataset.resumeWhenVisible === "true") {
        delete video.dataset.resumeWhenVisible;
        playVideo();
      }
    });

    if (prefersReducedMotion()) {
      pauseVideo();
    } else {
      playVideo();
    }

    const handleMotionPreference = (event) => {
      if (event.matches) {
        pauseVideo();
      }
    };

    on(reduceMotionQuery, "change", handleMotionPreference);
    updateButton();
  };

  /* ------------------------------------------------------------------
     Reveal motion
  ------------------------------------------------------------------ */
  const setupRevealMotion = () => {
    const motionElements = Array.from(doc.querySelectorAll("[data-motion]"));
    if (motionElements.length === 0) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      motionElements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    body.classList.add("motion-ready");

    const applyStagger = (selector, delayStep = 90) => {
      Array.from(doc.querySelectorAll(selector)).forEach((element, index) => {
        element.style.transitionDelay = `${index * delayStep}ms`;
      });
    };

    applyStagger("[data-motion='industry-card']", 80);
    applyStagger("[data-motion='solution-card']", 110);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    motionElements.forEach((element) => observer.observe(element));
  };

  /* ------------------------------------------------------------------
     Subtle image parallax
  ------------------------------------------------------------------ */
  const setupParallax = () => {
    const elements = Array.from(doc.querySelectorAll("[data-parallax='image']"));
    if (elements.length === 0 || prefersReducedMotion()) return;

    let ticking = false;

    const update = () => {
      const viewportHeight = window.innerHeight || 1;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const clamped = Math.max(0, Math.min(1, progress));
        const offset = (clamped - 0.5) * 34;

        element.style.translate = `0 ${offset.toFixed(2)}px`;
      });

      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    on(window, "scroll", requestUpdate, { passive: true });
    on(window, "resize", requestUpdate, { passive: true });
    requestUpdate();
  };

  /* ------------------------------------------------------------------
     Testimonial slider
  ------------------------------------------------------------------ */
  const setupSlider = () => {
    const slider = doc.querySelector("[data-testimonial-slider]");
    const track = slider?.querySelector("[data-slider-track]");
    const slides = slider ? Array.from(slider.querySelectorAll("[data-slide]")) : [];
    const previousButton = slider?.querySelector("[data-slider-prev]");
    const nextButton = slider?.querySelector("[data-slider-next]");
    const currentCounter = slider?.querySelector("[data-slider-current]");
    const viewport = slider?.querySelector(".testimonial-slider__viewport");

    if (!slider || !track || slides.length < 2) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    let pointerStartX = null;
    let pointerDeltaX = 0;
    let pausedByInteraction = false;

    const setSlide = (index, { announce = true } = {}) => {
      currentIndex = (index + slides.length) % slides.length;
      const shift = currentIndex * (100 / slides.length);

      track.style.transform = `translateX(-${shift}%)`;

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;
        slide.setAttribute("aria-hidden", String(!active));
      });

      if (currentCounter) {
        currentCounter.textContent = padNumber(currentIndex + 1);
      }

      if (viewport) {
        viewport.setAttribute("aria-live", announce ? "polite" : "off");
      }
    };

    const previous = (options) => setSlide(currentIndex - 1, options);
    const next = (options) => setSlide(currentIndex + 1, options);

    const stopAutoplay = () => {
      if (autoplayTimer !== null) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();

      if (prefersReducedMotion() || pausedByInteraction || doc.hidden) return;

      autoplayTimer = window.setInterval(() => {
        next({ announce: false });
      }, 7000);
    };

    const pauseForInteraction = () => {
      pausedByInteraction = true;
      stopAutoplay();
    };

    const resumeAfterInteraction = () => {
      pausedByInteraction = false;
      startAutoplay();
    };

    on(previousButton, "click", () => {
      previous();
      startAutoplay();
    });

    on(nextButton, "click", () => {
      next();
      startAutoplay();
    });

    on(slider, "keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "Home") {
        event.preventDefault();
        setSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setSlide(slides.length - 1);
      }
    });

    on(slider, "mouseenter", pauseForInteraction);
    on(slider, "mouseleave", resumeAfterInteraction);
    on(slider, "focusin", pauseForInteraction);
    on(slider, "focusout", (event) => {
      if (!slider.contains(event.relatedTarget)) {
        resumeAfterInteraction();
      }
    });

    on(slider, "pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerStartX = event.clientX;
      pointerDeltaX = 0;
      slider.setPointerCapture?.(event.pointerId);
      pauseForInteraction();
    });

    on(slider, "pointermove", (event) => {
      if (pointerStartX === null) return;
      pointerDeltaX = event.clientX - pointerStartX;
    });

    const finishSwipe = (event) => {
      if (pointerStartX === null) return;

      slider.releasePointerCapture?.(event.pointerId);

      if (Math.abs(pointerDeltaX) >= 48) {
        if (pointerDeltaX < 0) next();
        else previous();
      }

      pointerStartX = null;
      pointerDeltaX = 0;
      resumeAfterInteraction();
    };

    on(slider, "pointerup", finishSwipe);
    on(slider, "pointercancel", finishSwipe);

    on(doc, "visibilitychange", () => {
      if (doc.hidden) stopAutoplay();
      else startAutoplay();
    });

    on(reduceMotionQuery, "change", (event) => {
      if (event.matches) stopAutoplay();
      else startAutoplay();
    });

    setSlide(0, { announce: false });
    startAutoplay();
  };

  /* ------------------------------------------------------------------
     Client marquee
  ------------------------------------------------------------------ */
  const setupMarquee = () => {
    const marquee = doc.querySelector("[data-marquee]");
    const track = marquee?.querySelector(".clients-marquee__track");

    if (!marquee || !track) return;

    const originals = Array.from(track.children);
    if (originals.length === 0) return;

    // The stylesheet moves the track by 25%; four identical sets make the
    // animation loop at precisely one full set width with no visible jump.
    for (let setIndex = 0; setIndex < 3; setIndex += 1) {
      originals.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.removeAttribute("aria-label");
        track.appendChild(clone);
      });
    }

    if (prefersReducedMotion()) {
      track.style.animation = "none";
      return;
    }

    const pause = () => {
      track.style.animationPlayState = "paused";
    };

    const play = () => {
      if (!doc.hidden) track.style.animationPlayState = "running";
    };

    on(marquee, "mouseenter", pause);
    on(marquee, "mouseleave", play);
    on(marquee, "focusin", pause);
    on(marquee, "focusout", play);
    on(doc, "visibilitychange", () => {
      if (doc.hidden) pause();
      else play();
    });
  };

  /* ------------------------------------------------------------------
     Static-site forms
  ------------------------------------------------------------------ */
  const buildMailtoUrl = (form, subject, fields) => {
    const action = form.getAttribute("action") || "";
    const recipient = action.toLowerCase().startsWith("mailto:")
      ? action.slice(7).split("?")[0]
      : "dstone@mars-logic.com";

    const bodyText = fields
      .filter(([, value]) => String(value || "").trim())
      .map(([label, value]) => `${label}: ${String(value).trim()}`)
      .join("\n\n");

    return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  };

  const setupNewsletterForms = () => {
    doc.querySelectorAll("[data-newsletter-form]").forEach((form) => {
      const email = form.querySelector("input[type='email']");
      const error = form.querySelector(".form-field__error");
      const status = form.querySelector("[data-form-status]");
      if (!email || !error || !status) return;

      const validate = () => {
        const value = email.value.trim();
        let message = "";
        if (!value) message = "Enter an email address.";
        else if (!email.validity.valid) message = "Enter a valid email address.";
        error.textContent = message;
        email.setAttribute("aria-invalid", String(Boolean(message)));
        return !message;
      };

      on(email, "input", () => {
        if (error.textContent) validate();
        status.textContent = "";
      });
      on(email, "blur", validate);

      on(form, "submit", (event) => {
        event.preventDefault();
        status.textContent = "";
        if (!validate()) {
          email.focus();
          return;
        }

        const subject = form.dataset.mailtoSubject || "MARS newsletter subscription request";
        const url = buildMailtoUrl(form, subject, [
          ["Email", email.value],
          ["Request", "Please add this address to the MARS insights mailing list."],
        ]);

        status.textContent = "Opening your email application to complete the request…";
        window.location.href = url;
      });
    });
  };

  const setupContactForms = () => {
    doc.querySelectorAll("[data-contact-form]").forEach((form) => {
      const status = form.querySelector("[data-form-status]");
      const requiredFields = Array.from(form.querySelectorAll("[required]"));

      const setFieldError = (field) => {
        const wrapper = field.closest(".form-field");
        const error = wrapper?.querySelector(".form-field__error");
        if (!error) return field.validity.valid;

        let message = "";
        if (field.validity.valueMissing) message = "This field is required.";
        else if (field.validity.typeMismatch) message = "Enter a valid email address.";

        error.textContent = message;
        field.setAttribute("aria-invalid", String(Boolean(message)));
        return !message;
      };

      requiredFields.forEach((field) => {
        on(field, "blur", () => setFieldError(field));
        on(field, "input", () => {
          if (field.getAttribute("aria-invalid") === "true") setFieldError(field);
          if (status) status.textContent = "";
        });
      });

      on(form, "submit", (event) => {
        event.preventDefault();
        if (status) status.textContent = "";

        const invalid = requiredFields.filter((field) => !setFieldError(field));
        if (invalid.length) {
          invalid[0].focus();
          if (status) status.textContent = "Complete the required fields before preparing the email.";
          return;
        }

        const data = new FormData(form);
        const fullName = [data.get("first_name"), data.get("last_name")]
          .filter(Boolean)
          .join(" ");
        const subjectBase = form.dataset.mailtoSubject || "MARS project inquiry";
        const subject = fullName ? `${subjectBase} — ${fullName}` : subjectBase;
        const url = buildMailtoUrl(form, subject, [
          ["Name", fullName],
          ["Email", data.get("email")],
          ["Organization", data.get("organization")],
          ["Area of support", data.get("project_type")],
          ["Project details", data.get("message")],
        ]);

        if (status) status.textContent = "Opening your email application with the project details…";
        window.location.href = url;
      });
    });
  };

  /* ------------------------------------------------------------------
     Site utilities
  ------------------------------------------------------------------ */
  const setupUtilities = () => {
    doc.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });

  };

  const initialize = () => {
    setupMenu();
    setupVideoPlayer();
    setupRevealMotion();
    setupParallax();
    setupSlider();
    setupMarquee();
    setupNewsletterForms();
    setupContactForms();
    setupUtilities();
  };

  initialize();
})();
