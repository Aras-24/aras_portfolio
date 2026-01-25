// GLOBALE KONSTANTEN & DRITTPARTEI-SETUP
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const ScrollSmoother = window.ScrollSmoother;
const { innerHeight } = window; 

let smoother;

if (gsap && ScrollTrigger && ScrollSmoother) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
} else {
    console.error("GSAP oder ein notwendiges Plugin ist nicht geladen.");
}


// 0. PARTICLE.JS & HAUPT-INITIALISIERUNG
/**
 * Initialisiert den Particle.js-Hintergrund.
 */
function initParticles() {
    if (typeof particlesJS !== 'function') return; 
    particlesJS("particles-js", {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#95a0e3" },
            shape: { type: "circle" },
            opacity: { value: 0.51, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#00aeac", opacity: 0.5, width: 1 },
            move: { enable: true, speed: 5, direction: "none", out_mode: "out" },
        },
        interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 200, duration: 0.4 } },
        },
        retina_detect: true,
    });
}

/**
 * Initialisiert GSAP ScrollSmoother und Snapping.
 */
function initScrollSmoother() {
    if (!ScrollSmoother) return;

    const sections = gsap.utils.toArray(
        "#smooth-content > .hero, #smooth-content > .about, #smooth-content > .skills, #smooth-content > .projects-wrapper, #smooth-content > .contact"
    );

    smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
        snap: {
            snapTo: 1 / (sections.length - 1), 
            duration: 0.8,
            ease: "power2.inOut",
        },
    });

    return smoother;
}



// 1. NAVIGATION & THEME & CURSOR

/**
 * Verwaltet das Custom Cursor Verhalten.
 */
function setupCustomCursor() {
    if (window.innerWidth <= 768) return;

    const cursor = document.querySelector(".cursor");
    const cursorFollower = document.querySelector(".cursor-follower");

    if (!cursor || !cursorFollower) return;

    document.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX - 10,
            y: e.clientY - 10,
            duration: 0.3,
            ease: "power2.out",
        });
        gsap.to(cursorFollower, {
            x: e.clientX - 15,
            y: e.clientY - 15,
            duration: 0.6,
            ease: "power2.out",
        });
    });

    const hoverables = document.querySelectorAll(
        "a, button, #themeToggle, .skill-circle-container"
    );

    hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            gsap.to(cursor, {
                scale: 1.5,
                background: "rgba(255, 255, 255, 0.8)",
                duration: 0.3,
            });
            gsap.to(cursorFollower, { scale: 0.5, opacity: 0, duration: 0.3 });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(cursor, { scale: 1, background: "var(--accent)", duration: 0.3 });
            gsap.to(cursorFollower, { scale: 1, opacity: 1, duration: 0.3 });
        });
    });
}

/**
 * Verwaltet Theme-Toggle, Mobile Menu und die Klick-Navigation (Anchor-Links).
 */
function setupUIInteractions() {
    const body = document.body;
    const themeToggle = document.querySelector("#themeToggle");
    const menuToggle = document.querySelector("#menuToggle");
    const mobileMenu = document.querySelector("#mobileMenu");
    
    
    // Theme Toggle
    const currentTheme = localStorage.getItem("theme") || "dark";
    body.setAttribute("data-theme", currentTheme);
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const newTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
            body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            gsap.to(themeToggle, { scale: 0.9, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" });
        });
    }

    // Mobile Menu
    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            menuToggle.classList.toggle("active");
            mobileMenu.classList.toggle("active");
            document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
        };
        menuToggle.addEventListener("click", toggleMenu);
        mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", toggleMenu));
    }

    // Anchor Clicks (WICHTIG für ScrollSmoother)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (smoother && targetId) {
                // Scrollt sanft zur Zielsektion mit der ScrollSmoother API
                smoother.scrollTo(targetId, true, 'top top');
            } else if (targetId) {
                // Fallback, falls Smoother nicht geladen ist
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    setupCustomCursor(); 
}


// 2. LOADING ANIMATION & HAUPT-INITIALISIERUNG

/**
 * Verwaltet die Lade-Animation und startet die Haupt-Animationen nach Abschluss.
 */
function initLoader() {
    const loader = document.querySelector(".loader");
    const loaderText = document.querySelector(".loader-text");
    const loaderProgress = document.querySelector(".loader-progress");
    const smoothWrapper = document.querySelector("#smooth-wrapper");
    const backgroundElements = document.querySelectorAll(".hero-3d-model, #particles-js");
    const navBar = document.querySelector("nav");

    // Fallback: Wenn Loader fehlt, direkt anzeigen und Animationen starten.
    if (!loader || !smoothWrapper) {
        if (smoothWrapper) smoothWrapper.style.opacity = 1;
        gsap.set([backgroundElements, navBar], { opacity: 1 });
        initAnimations();
        return;
    }

    // Haupt-Lade-Timeline
    const loadingTimeline = gsap.timeline({
        onComplete: () => {
            loader.style.display = "none";
            initAnimations(); // Startet alle Sektions-Animationen
        }
    });

    // 1. Text und Ladebalken
    loadingTimeline.to(loaderText, { opacity: 1, duration: 0.7, ease: "power2.out" })
        .to(loaderProgress, { width: "100%", duration: 2, ease: "power2.inOut" }, "<")

        // 2. Loader ausblenden (während Hauptinhalt eingeblendet wird)
        .to(loader, { opacity: 0, duration: 0.7 }, "+=0.2") 

        // 3. Hauptinhalt, Hintergrund & Nav einblenden
        .to([smoothWrapper, backgroundElements, navBar], {
            opacity: 1,
            duration: 1.0, 
            ease: "power2.inOut",
        }, "<0.1"); 
}

/**
 * Zentrale Funktion, die alle Initialisierungen steuert.
 */
function initialize() {
    initParticles();
    smoother = initScrollSmoother(); 
    setupUIInteractions(); 

    // Die Hauptlogik, die auf window.load wartet, um den Ladevorgang zu starten
    window.addEventListener("load", initLoader);
}
document.addEventListener("DOMContentLoaded", initialize);



// 3. HAUPT-ANIMATIONEN (GSAP)

/**
 * Zentrale Funktion zum Starten aller Haupt-GSAP-Animationen.
 */
function initAnimations() {
    initHeroAnimations();
    initAboutAnimations();
    initSkillAnimations();

    if (window.innerWidth > 768) {
        initProjectHorizontalScroll(); 
    } else {
        initProjectMobileAnimations(); 
    }

    initContactFormFocus();
}

/**
 * Initialisiert die Scroll-gesteuerten (Scrubbing/Parallax) Animationen für die Hero-Sektion.
 */
function initHeroAnimations() {
   

    // Staggered Fade-in der Hero-Texte (einmalig nach dem Laden)
    const heroTimeline = gsap.timeline({
        delay: 0.8,
        defaults: {
            duration: 1.0,
            ease: "power3.out",
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
        },
    });

    heroTimeline
        .to(".hero-title", {})
        .to(".hero-subtitle", { duration: 0.8 }, "<0.1")
        .to(".hero-description", { duration: 0.8 }, "<0.1")
        .to(".hero-button", { duration: 0.8 }, "<0.1");


    
   
    
    // TEXT-INHALTE kommen von RECHTS
    gsap.fromTo(".hero-content",
        { xPercent: 20, opacity: 0 }, 
        { 
            xPercent: 0, 
            opacity: 1, 
            y: -30, // Parallax nach oben
            ease: "none",
            
        }
    );

    // BILD kommt von LINKS UNTEN
    gsap.fromTo(".hero-img",
        { xPercent: 50, yPercent: 50, opacity: 0 }, // Startet links (-50%) und unten (50%)
        { 
            xPercent: 0, 
            yPercent: 0,
            opacity: 1,
            y: -20, // Leichter Parallax nach oben (weniger als Text)
            ease: "none",  
        }
    );

    // 3D-Modell Parallax und Fade-Out
    gsap.to(".hero-3d-model", {
        scale: 1.2,
        y: 100, 
        opacity: 0,
        ease: "none",
        scrollTrigger: { 
            trigger: ".hero", 
            start: "top top", 
            end: "bottom 50%", 
            scrub: 1.5
        },
    });
}

/**
 * Initialisiert die Scroll-gesteuerten (Scrubbing/Parallax) Animationen für die About-Sektion.
 */
function initAboutAnimations() {
    const aboutScrollTrigger = {
        trigger: ".about",
        start: "top bottom", 
        end: "center top",
        scrub: true, 
    };

    gsap.fromTo(".about-content", 
        { x: 550, y: -100, opacity: 0 },
        { 
            x: 0, y: 0, opacity: 1, ease: "power2.out",
            y: -50, 
            scrollTrigger: { 
                ...aboutScrollTrigger,
                scrub: 1.5
            } 
        }
    );

    gsap.fromTo(".about-image", 
        { x: -550, y: -100, opacity: 0 },
        { 
            x: 0, y: 0, opacity: 1, ease: "power2.out",
            y: 10, 
            scrollTrigger: { 
                ...aboutScrollTrigger, 
                scrub: 2
            } 
        }
    );

    gsap.fromTo(".about-image img",
        { scale: 1.2 }, 
        {
            scale: 1, 
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".about-image",
                start: "top 80%", 
                toggleActions: "play none none none", 
            },
        }
    );
}

/**
 * Initialisiert die Scroll-gesteuerten (Scrubbing/Parallax) Animationen für die Skill-Sektion.
 */
function initSkillAnimations() {
    const skillCards = document.querySelectorAll(".skill-circle-container");
    const skillContainer = document.querySelector(".skills-container");

    if (!skillCards.length || !skillContainer) return;

    // 1. Staggered Entrance Animation (Flip-Effekt) mit SCRUBBING
    gsap.set(skillCards, { opacity: 0, rotationY: 90, scale: 0.1 });

    gsap.to(skillCards, {
        opacity: 1,
        rotationY: 0,
        scale: 1,
        stagger: 0.1, 
        ease: "power2.out", 
        scrollTrigger: {
            trigger: skillContainer,
            start: "top 90%", 
            end: " center 90% ", 
            scrub: 1.5, 
        },
    });

    // 2. Initialisiere jede einzelne Skill-Karte (Ring- & Zähler-Animation)
    skillCards.forEach((card) => {
        const level = parseInt(card.getAttribute("data-skill-level")) || 0;
        const percentageElement = card.querySelector(".skill-percentage-display");
        const progressElement = card.querySelector(".ring-progress");
        const skillIcon = card.querySelector(".skill-icon");
        const iconOutline = card.querySelector(".icon-outline");
        const iconFilled = card.querySelector(".icon-filled");
        const circle3d = card.querySelector(".skill-circle-3d");

        if (!percentageElement || !progressElement || !circle3d) {
            return;
        }

        const radius = 67;
        const circumference = 2 * Math.PI * radius;
        const endOffset = circumference - (level / 100) * circumference;
        const counter = { count: 0 };

        // 2.1. Zahlen-Counter & Kreisdiagramm (SCRUBBING)
        gsap.set(progressElement, { strokeDashoffset: circumference });

        gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 80%", 
                end: "center 80%", 
                scrub: 1, 
            }
        })
        .to(progressElement, { strokeDashoffset: endOffset, ease: "none" }, 0)
        .to(counter, {
            count: level, 
            ease: "none",
            onUpdate: function () {
                percentageElement.textContent = Math.round(counter.count) + "%";
            },
        }, 0)
        .fromTo(percentageElement, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0); 

        // ZUSÄTZLICHER GLOW
        gsap.to(progressElement, {
            filter: `drop-shadow(0 0 6px var(--accent))`,
            opacity: 0.9,
            scrollTrigger: {
                trigger: card,
                start: "top 70%",
                end: "top 50%", 
                scrub: 0.5,
                ease: "power1.inOut",
                onReverseComplete: () => {
                    gsap.set(progressElement, { filter: 'none', opacity: 1 });
                }
            }
        });


        // 2.2. Hover-Interaktionen
        const hoverTl = gsap.timeline({ paused: true, reversed: true });

        hoverTl.to(
            circle3d,
            {
                y: -10, z: 10, rotationX: -5, rotationY: 5,
                boxShadow: "0 15px 35px 5px rgba(44, 71, 73, 0.7), 0 0 25px 10px var(--accent), inset 0 0 10px rgba(8, 228, 224, 0.5)",
                duration: 0.4, ease: "power2.out",
            },
            0
        );

        if (skillIcon && iconOutline && iconFilled) {
            hoverTl
                .to(skillIcon, { scale: 1.8, duration: 0.3, ease: "power2.out" }, 0)
                .to(iconOutline, { opacity: 0, duration: 0.2 }, 0)
                .to(iconFilled, { opacity: 1, duration: 0.2 }, 0);
        }

        let hoverCountAnimation; 

        if (skillIcon && circle3d) {
            card.addEventListener("mouseenter", () => {
                hoverTl.play(); 
                if (hoverCountAnimation) {
                    hoverCountAnimation.kill();
                }

                const hoverCounter = { count: 0 };
                percentageElement.textContent = "0%";

                hoverCountAnimation = gsap.to(hoverCounter, {
                    count: level, 
                    duration: 0.9, 
                    ease: "power2.out",
                    onUpdate: () => {
                        percentageElement.textContent = Math.round(hoverCounter.count) + "%";
                    },
                });
            });

            card.addEventListener("mouseleave", () => {
                hoverTl.reverse(); 

                if (hoverCountAnimation) {
                    hoverCountAnimation.kill();
                }
                // Stellt den Wert auf den finalen Skill-Level zurück, wenn Hover endet
                percentageElement.textContent = level + "%";
            });

            // 2.3. Magnet-Effekt
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const dX = gsap.utils.mapRange(0, rect.width, -10, 10, x - centerX);
                const dY = gsap.utils.mapRange(0, rect.height, -10, 10, y - centerY);

                gsap.to(skillIcon, { x: dX, y: dY, duration: 0.2, ease: "power2.out" });
                gsap.to(circle3d, {
                    rotationX: dY * -0.2,
                    rotationY: dX * 0.2,
                    duration: 0.5,
                    ease: "power1.out",
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(skillIcon, {
                    x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)",
                });
            });
        }
    });
}


/**
 * Initialisiert die horizontale Scroll-Animation für die Projekte-Sektion (Desktop).
 */
function initProjectHorizontalScroll() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const container = document.querySelector(".projects-container");
    const wrapper = document.querySelector(".projects-wrapper");
    const projectCards = gsap.utils.toArray(".project-card");
    const projectTitle = document.querySelector(".section-projects-title");
    const projectSubtitle = document.querySelector(".section-projects-subtitle");

    if (!container || !wrapper || projectCards.length === 0 || !projectTitle || !projectSubtitle) return;

    const projectsWidth = container.scrollWidth;
    const wrapperWidth = wrapper.offsetWidth;
    const scrollDistance = projectsWidth - wrapperWidth;
    
    if (scrollDistance <= 0) return;

    const horizontalTween = gsap.to(container, {
        x: -scrollDistance, 
        ease: "none", 
    });

    // TITEL UND UNTERTITEL ANIMATION
    gsap.set([projectTitle, projectSubtitle], { y: 30, opacity: 0 });

    const titleTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: "top 70%", 
            end: "top 10%", 
            scrub: true,
        }
    });

    titleTimeline
        .to(projectTitle, { y: 0, opacity: 1, ease: "power2.out" })
        .to(projectSubtitle, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "<0.1");

    // SCROLLTRIGGER FÜR PINNING & SCROLLING
    ScrollTrigger.create({
        trigger: wrapper,
        pin: true, 
        scrub: 1, 
        animation: horizontalTween,
        invalidateOnRefresh: true, 
        start: "top top",
        end: () => `+=${scrollDistance}`,
        snap: {
            snapTo: 1 / (projectCards.length - 1), 
            duration: 0.3,
            delay: 0.1,
            ease: "power2.out"
        }
    });

    // Staggered Entrance Animation (der Karten)
    gsap.from(projectCards, {
        y: 50,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: wrapper,
            start: "top 80%", 
            toggleActions: "play none none none", 
        },
    });

    // KARTEN HOVER-GLOW & 3D-Effekt
    projectCards.forEach(card => {
        const hoverTl = gsap.timeline({ paused: true, reversed: true });

        hoverTl.to(card, {
            rotationX: -2, rotationY: 2, y: -5, z: 5,
            boxShadow: "0 15px 45px rgba(0, 174, 172, 0.5), 0 0 15px rgba(0, 174, 172, 0.7)", 
            duration: 0.3,
            ease: "power2.out",
        }, 0);
        
        hoverTl.to(card.querySelector('.project-image'), {
             scale: 1.05, rotation: 0.5, duration: 0.5, ease: "power2.out",
        }, 0); 

        card.addEventListener("mouseenter", () => hoverTl.play());
        card.addEventListener("mouseleave", () => hoverTl.reverse());
    });
}


/**
 * Initialisiert die Scroll-gesteuerten Animationen für die Projekte-Sektion (Mobile).
 */
function initProjectMobileAnimations() {
    if (window.innerWidth > 768) return;

    const projectCards = gsap.utils.toArray(".project-card");
    const projectTitle = document.querySelector(".section-projects-title");
    const projectSubtitle = document.querySelector(".section-projects-subtitle");
    const wrapper = document.querySelector(".projects-wrapper"); 
    
    if (!wrapper || projectCards.length === 0) {
        return; 
    }

    // TITEL UND UNTERTITEL ANIMATION (Fade-in-Up)
    if (projectTitle && projectSubtitle) {
        gsap.set([projectTitle, projectSubtitle], { y: 30, opacity: 0 });

        const titleTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: "top 90%", 
                toggleActions: "play none none none", 
            }
        });

        titleTimeline
            .to(projectTitle, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
            .to(projectSubtitle, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "<0.1");
    }
    
    // KARTEN ANIMATION (abwechselnd von Links/Rechts)
    projectCards.forEach((card, index) => {
        const startX = index % 2 === 0 ? -100 : 100;

        gsap.from(card, {
            x: startX,
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 70%", 
                end: "top 20%",
                toggleActions: "play none none reverse", 
            },
        });
    });
}


/**
 * Initialisiert die Fokus- und Blur-Animation für die Formular-Labels.
 */
function initContactFormFocus() {
    const inputs = document.querySelectorAll(".contact-form .input");

    function focusFunc() {
        this.parentNode.classList.add("focus");
    }

    function blurFunc() {
        if (this.value === "") {
            this.parentNode.classList.remove("focus");
        }
    }

    inputs.forEach((input) => {
        input.addEventListener("focus", focusFunc);
        input.addEventListener("blur", blurFunc);
    });
}