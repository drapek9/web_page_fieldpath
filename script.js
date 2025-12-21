"use sctrict"
// menu //

function setLanguage(lang) {
    document.querySelectorAll('[data-cs]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    document.documentElement.lang = lang === 'cs' ? 'cs' : 'en';
    localStorage.setItem('lang', lang); // uloží volbu uživatele
  }

fetch('https://ipwhois.app/json/')
  .then(res => res.json())
  .then(data => {
    const country = data.country_code;
    if(["CZ", "SK"].includes(country)) setLanguage('cs');
    else setLanguage('en');
  })
  .catch(err => console.error(err));

document.querySelector("#menu_button").addEventListener("click", (event) => {
    event.preventDefault();

    let theDiv = document.querySelector("#root_div_a");

    let theOpacity = getComputedStyle(theDiv).opacity;

    if (theOpacity == 1) {
        theDiv.style.opacity = 0;
        theDiv.style.disabled = 0;
        theDiv.style.pointerEvents = "none";
    } else {
        theDiv.style.opacity = 1;
        theDiv.style.pointerEvents = "all";
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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that should animate
    const animateElements = document.querySelectorAll('.mobile_article, .mobile_multiple_article, .mobile_article_content, .events_div_photos, .get_the_app_button, .social_ul li, .app_user_stats, .content_stats > div');
    animateElements.forEach(el => observer.observe(el));

    // Parallax effect for background elements
    const bgElements = document.querySelectorAll('.bg-stat, .bg-circle, .bg-chart');
    
    // Uložit původní rotace
    const originalRotations = {};
    bgElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el);
        const transform = computedStyle.transform;
        const match = transform.match(/rotate\(([^)]+)\)/);
        originalRotations[index] = match ? match[1] : '0deg';
    });
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        bgElements.forEach((el, index) => {
            const speed = 0.3 + (index % 3) * 0.1; // Různé rychlosti pro různé prvky
            const yPos = -(scrolled * speed);
            const rotation = originalRotations[index] || '0deg';
            el.style.transform = `translateY(${yPos}px) rotate(${rotation})`;
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
});