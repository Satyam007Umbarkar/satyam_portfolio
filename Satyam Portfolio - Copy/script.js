window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");

    const frameCount = 120;
    const getFramePath = i => `my-images/frame_${String(i).padStart(3, "0")}_delay-0.066s.png`;

    // ── Canvas sizing ──
    function fitCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    fitCanvas();
    window.addEventListener("resize", () => { fitCanvas(); drawFrame(obj.frame); });

    // ── Preload frames ──
    const frames = [];
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload  = () => { if (i === 0) drawFrame(0); };
        img.onerror = () => console.warn("Missing frame:", getFramePath(i));
        img.src = getFramePath(i);
        frames.push(img);
    }

    // ── Draw a frame (cover-fit, top-anchored) ──
    function drawFrame(index) {
        const i   = Math.round(index);
        const img = frames[i];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const cW = canvas.width,  cH = canvas.height;
        const iW = img.naturalWidth, iH = img.naturalHeight;
        const scale = Math.max(cW / iW, cH / iH);
        const dW = iW * scale, dH = iH * scale;
        const dx = (cW - dW) / 2;
        const dy = 0; // top-anchored so face shows fully

        ctx.clearRect(0, 0, cW, cH);
        ctx.drawImage(img, dx, dy, dW, dH);
    }

    // ── Canvas scrub tied to #scroll-driver ──
    const obj = { frame: 0 };
    gsap.to(obj, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
            trigger: "#scroll-driver",
            start: "top top",
            end:   "bottom bottom",
            scrub: 0.5,
        },
        onUpdate: () => drawFrame(obj.frame)
    });

    // ── Stage 1: Name — appears when face looks straight (10%–30%) ──
    const overlayName = document.getElementById("overlay-name");
    gsap.timeline({
        scrollTrigger: {
            trigger: "#scroll-driver",
            start: "10% top",
            end:   "32% top",
            scrub: 1,
        }
    })
    .fromTo(overlayName, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 })
    .to(overlayName,     { opacity: 0, y: -20, duration: 0.4 });

    // ── Stage 2: Experience — appears mid-scroll (35%–58%) ──
    const overlayExp = document.getElementById("overlay-exp");
    gsap.timeline({
        scrollTrigger: {
            trigger: "#scroll-driver",
            start: "35% top",
            end:   "58% top",
            scrub: 1,
        }
    })
    .fromTo(overlayExp, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 })
    .to(overlayExp,     { opacity: 0, y: -20, duration: 0.4 });

    // ── Stage 3: Tagline — appears late (62%–85%) ──
    const overlayTagline = document.getElementById("overlay-tagline");
    gsap.timeline({
        scrollTrigger: {
            trigger: "#scroll-driver",
            start: "62% top",
            end:   "85% top",
            scrub: 1,
        }
    })
    .fromTo(overlayTagline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 })
    .to(overlayTagline,     { opacity: 0, y: -20, duration: 0.4 });

    // ── Section fade-ins (IntersectionObserver — no GSAP needed) ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".section-fade").forEach(el => observer.observe(el));
});
