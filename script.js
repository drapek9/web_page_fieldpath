"use strict";
// menu //

function detectBrowserLanguage() {
    const browserLangs = navigator.languages?.length
        ? navigator.languages
        : [navigator.language || "en"];

    const prefersCzech = browserLangs.some((lang) => {
        const code = lang.toLowerCase().slice(0, 2);
        return code === "cs" || code === "sk";
    });

    return prefersCzech ? "cs" : "en";
}

function setLanguage(lang) {
    if (lang !== "cs" && lang !== "en") return;

    document.querySelectorAll("[data-cs]").forEach((el) => {
        const translation = el.dataset[lang];
        const value = translation || el.dataset.en;
        if (!value) return;

        if (el.tagName === "META") {
            el.setAttribute("content", value);
        } else if (el.tagName === "IMG") {
            el.setAttribute("alt", value);
        } else {
            el.textContent = value;
        }
    });

    const titleEl = document.querySelector("title");
    if (titleEl) {
        const title = titleEl.dataset[lang] || titleEl.dataset.en;
        if (title) titleEl.textContent = title;
    }

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute("content", lang === "cs" ? "cs_CZ" : "en_US");

    document.documentElement.lang = lang === "cs" ? "cs" : "en";
    localStorage.setItem("lang", lang);

    document.querySelectorAll(".lang_switcher_btn").forEach((btn) => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle("is_active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (lang === "en") {
        document.querySelector(".why_video")?.pause();
    }
}

function initLanguage() {
    const saved = localStorage.getItem("lang");
    if (saved === "cs" || saved === "en") {
        setLanguage(saved);
        return;
    }

    setLanguage(detectBrowserLanguage());
}

initLanguage();

document.querySelectorAll(".lang_switcher_btn").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

document.querySelector(".site_header_brand")?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMobileNav();
});

document.querySelector("#menu_button").addEventListener("click", (event) => {
    event.preventDefault();

    const nav = document.querySelector("#root_div_a");
    const button = document.querySelector("#menu_button");
    const isOpen = nav.classList.toggle("is_open");
    button.classList.toggle("is_open", isOpen);
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

function closeMobileNav() {
    const nav = document.querySelector("#root_div_a");
    const button = document.querySelector("#menu_button");
    nav.classList.remove("is_open");
    button.classList.remove("is_open");
    button.setAttribute("aria-expanded", "false");
}

document.querySelectorAll('#root_div_a a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 700) {
            closeMobileNav();
        }
    });
});

document.querySelectorAll(".faq_item").forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) return;

        document.querySelectorAll(".faq_item").forEach((other) => {
            if (other !== item) {
                other.open = false;
            }
        });
    });
});

document.querySelector(".site_header_download")?.addEventListener("click", (event) => {
    event.preventDefault();
    const downloadSection = document.getElementById("download");
    if (downloadSection) {
        downloadSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (window.pauseReviewsCarousel) {
        window.pauseReviewsCarousel();
    }
    if (window.innerWidth <= 700) {
        closeMobileNav();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
        closeMobileNav();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".value");
    const duration = 1500; // celková doba animace v ms

    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let start = 0;
        const stepTime = 16; // cca 60fps
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                counter.textContent = target.toLocaleString() + "+";
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(start).toLocaleString() + "+";
            }
        }, stepTime);
    });

    // Scroll animations for sections
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserverOptions = {
        threshold: 0,
        rootMargin: '0px 0px 180px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that should animate
    const animateElements = document.querySelectorAll('.mobile_article, .mobile_multiple_article, .mobile_article_content, .events_div_photos, .social_ul li, .premium_section, .premium_card, .why_content, .why_visual, .faq_section, .community_header');
    animateElements.forEach(el => observer.observe(el));

    document.querySelectorAll('.get_the_app_button').forEach((el) => {
        if (!el.closest('.hero')) {
            observer.observe(el);
        }
    });

    const hero = document.querySelector('.hero');
    if (hero) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            hero.classList.add('hero--animated');
        } else {
            requestAnimationFrame(() => hero.classList.add('hero--animated'));
        }
    }

    const statsSection = document.querySelector('.app_user_stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                statsSection.classList.add('animate-in');
                statsSection.querySelectorAll('.content_stats > div').forEach((stat) => {
                    stat.classList.add('animate-in');
                });
                statsObserver.unobserve(statsSection);
            });
        }, statsObserverOptions);

        statsObserver.observe(statsSection);
    }

    const communityCarousel = document.querySelector('.community_carousel');
    const communityVideoItems = document.querySelectorAll('.community_video_item');

    if (communityCarousel && communityVideoItems.length) {
        const communityVideoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    communityVideoItems.forEach(item => item.classList.add('animate-in'));
                    communityVideoObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        communityVideoObserver.observe(communityCarousel);
    }

    const communityFeed = document.querySelector('.community_feed');
    const communityPrev = document.querySelector('.community_carousel_btn--prev');
    const communityNext = document.querySelector('.community_carousel_btn--next');

    if (communityFeed && communityPrev && communityNext) {
        const getCommunityScrollStep = () => {
            const item = communityFeed.querySelector('.community_video_item');
            if (!item) return 238;
            const gap = parseFloat(getComputedStyle(communityFeed).gap) || 18;
            return item.offsetWidth + gap;
        };

        const updateCommunityNav = () => {
            const maxScroll = communityFeed.scrollWidth - communityFeed.clientWidth;
            communityPrev.disabled = communityFeed.scrollLeft <= 2;
            communityNext.disabled = communityFeed.scrollLeft >= maxScroll - 2;
        };

        communityPrev.addEventListener('click', () => {
            communityFeed.scrollBy({ left: -getCommunityScrollStep(), behavior: 'smooth' });
        });

        communityNext.addEventListener('click', () => {
            communityFeed.scrollBy({ left: getCommunityScrollStep(), behavior: 'smooth' });
        });

        communityFeed.addEventListener('scroll', updateCommunityNav, { passive: true });
        window.addEventListener('resize', updateCommunityNav);
        updateCommunityNav();
    }

    // Parallax effect for background elements
    const bgElements = document.querySelectorAll('.bg-stat, .bg-circle, .bg-chart');
    
    // Uložit původní transformace (včetně rotací), aby se při scrollu neztratilo naklonění
    const originalTransforms = {};
    bgElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el);
        const transform = computedStyle.transform;
        // Pokud není žádná transformace, uložíme prázdný řetězec
        originalTransforms[index] = transform === 'none' ? '' : transform;
    });
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        bgElements.forEach((el, index) => {
            const speed = 0.3 + (index % 3) * 0.1; // Různé rychlosti pro různé prvky
            const yPos = -(scrolled * speed);
            const baseTransform = originalTransforms[index] || '';
            // Zachováme původní transformaci (včetně rotace) a jen přidáme translateY
            el.style.transform = `translateY(${yPos}px) ${baseTransform}`;
        });

        // Parallax pro mřížku
        const gridSpeed = 0.1;
        const gridYPos = -(scrolled * gridSpeed);
        document.body.style.setProperty('--grid-y', `${gridYPos}px`);
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    const reviewSlides = document.querySelectorAll(".review_slide");
    const reviewDots = document.querySelectorAll(".reviews_dot");
    if (reviewSlides.length && reviewDots.length) {
        let currentReview = 0;
        let reviewIntervalId = null;

        const showReview = (index) => {
            currentReview = index;
            reviewSlides.forEach((slide, i) => slide.classList.toggle("is_active", i === currentReview));
            reviewDots.forEach((dot, i) => {
                dot.classList.toggle("is_active", i === currentReview);
                dot.setAttribute("aria-selected", i === currentReview ? "true" : "false");
            });
        };

        const startReviewsCarousel = () => {
            if (reviewIntervalId) return;
            reviewIntervalId = window.setInterval(() => {
                showReview((currentReview + 1) % reviewSlides.length);
            }, 7000);
        };

        window.pauseReviewsCarousel = () => {
            if (!reviewIntervalId) return;
            clearInterval(reviewIntervalId);
            reviewIntervalId = null;
        };

        reviewDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showReview(index);
                window.pauseReviewsCarousel();
            });
        });

        const downloadSection = document.getElementById("download");
        if (downloadSection) {
            const downloadObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        window.pauseReviewsCarousel();
                    } else {
                        startReviewsCarousel();
                    }
                });
            }, { threshold: 0.35 });

            downloadObserver.observe(downloadSection);
        }

        startReviewsCarousel();
    }
});