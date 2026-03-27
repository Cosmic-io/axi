/* ═══════════════════════════════════════════
   AXI — Script
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Scroll Reveal (Intersection Observer) ─── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger siblings
        const delay = Array.from(e.target.parentElement.children)
          .filter(c => c.classList.contains('reveal'))
          .indexOf(e.target) * 80;
        setTimeout(() => e.target.classList.add('visible'), delay);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // Fallback: reveal any elements still hidden after 2s (e.g. if observer doesn't fire)
  setTimeout(() => {
    revealEls.forEach(el => {
      if (!el.classList.contains('visible')) el.classList.add('visible');
    });
  }, 2000);

  /* ─── Nav Scroll → Floating Pill ─── */
  const navEl = document.getElementById('nav');
  let lastScrollY = 0;
  const SCROLL_THRESHOLD = 100;

  function updateNav() {
    const sy = window.scrollY;
    if (sy > SCROLL_THRESHOLD) {
      navEl.classList.add('nav--scrolled');
    } else {
      navEl.classList.remove('nav--scrolled');
    }

    // Detect if we're over a dark section
    const navBottom = navEl.getBoundingClientRect().bottom;
    const darkSections = document.querySelectorAll('.section--dark');
    let overDark = false;
    darkSections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < navBottom && rect.bottom > 0) {
        overDark = true;
      }
    });
    if (overDark && sy > SCROLL_THRESHOLD) {
      navEl.classList.add('nav--dark');
    } else {
      navEl.classList.remove('nav--dark');
    }

    lastScrollY = sy;
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ─── Mobile Nav Toggle ─── */
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav__mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => nav.classList.toggle('nav--open'));
    document.querySelectorAll('.nav__links a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('nav--open'));
    });
  }

  /* ─── Button Orbiting Gradient Border ─── */
  document.querySelectorAll('.btn').forEach(btn => {
    let frame;
    let angle = 0;
    btn.addEventListener('mouseenter', () => {
      function spin() {
        angle = (angle + 3) % 360;
        btn.style.setProperty('--btn-angle', angle + 'deg');
        frame = requestAnimationFrame(spin);
      }
      spin();
    });
    btn.addEventListener('mouseleave', () => {
      cancelAnimationFrame(frame);
    });
  });

  /* ─── Automate Slider ─── */
  const slider = document.getElementById('automateSlider');
  const planName = document.getElementById('planName');
  const planPrice = document.getElementById('planPrice');
  const planNote = document.getElementById('planNote');

  const tiers = [
    { max: 0, name: 'Free', price: '$0', note: '0 automation slots' },
    { max: 1, name: 'Starter', price: '$2,500', note: '1 active automation slot' },
    { max: 2, name: 'Starter+', price: '$4,000', note: '2 active automation slots' },
    { max: 3, name: 'Growth', price: '$6,000', note: '3 active automation slots' },
    { max: 4, name: 'Growth+', price: '$7,200', note: '4 active automation slots' },
    { max: 5, name: 'Pro', price: '$8,500', note: '5 active automation slots' },
    { max: 6, name: 'Pro+', price: '$9,500', note: '6 active automation slots' },
    { max: 7, name: 'Business', price: '$10,200', note: '7 active automation slots' },
    { max: 8, name: 'Business+', price: '$10,900', note: '8 active automation slots' },
    { max: 9, name: 'Scale', price: '$11,500', note: '9 active automation slots' },
    { max: 10, name: 'Scale', price: '$12,000', note: '10 active automation slots' },
  ];

  function updateSlider() {
    const v = parseInt(slider.value, 10);
    const tier = tiers[v];
    planName.textContent = tier.name;
    planPrice.textContent = tier.price;
    planNote.textContent = tier.note;
    // Update gradient fill
    const pct = (v / 10) * 100;
    slider.style.background = `linear-gradient(to right, #7c5cfc 0%, #7c5cfc ${pct}%, #e0e0e0 ${pct}%, #e0e0e0 100%)`;
  }
  if (slider) {
    slider.addEventListener('input', updateSlider);
    updateSlider();
  }

  /* ─── Network Canvas (CTA section) ─── */
  const netCanvas = document.getElementById('networkCanvas');
  if (netCanvas) {
    const nctx = netCanvas.getContext('2d');
    let nodes = [];
    const NODE_COUNT = 60;
    let nW, nH;

    function resizeNet() {
      const rect = netCanvas.parentElement.getBoundingClientRect();
      nW = netCanvas.width = rect.width;
      nH = netCanvas.height = rect.height;
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * nW,
          y: Math.random() * nH,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: 1.5 + Math.random() * 2,
        });
      }
    }

    function drawNet() {
      nctx.clearRect(0, 0, nW, nH);
      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            nctx.strokeStyle = `rgba(124,92,252,${0.15 * (1 - dist / 140)})`;
            nctx.lineWidth = 0.6;
            nctx.beginPath();
            nctx.moveTo(nodes[i].x, nodes[i].y);
            nctx.lineTo(nodes[j].x, nodes[j].y);
            nctx.stroke();
          }
        }
      }
      // Draw & update nodes
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > nW) n.vx *= -1;
        if (n.y < 0 || n.y > nH) n.vy *= -1;
        nctx.fillStyle = 'rgba(124,92,252,0.5)';
        nctx.beginPath();
        nctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        nctx.fill();
      });
      requestAnimationFrame(drawNet);
    }

    resizeNet();
    initNodes();
    drawNet();
    window.addEventListener('resize', () => { resizeNet(); initNodes(); });
  }

  /* ─── FAQ exclusive open ─── */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  /* ─── Hero Floating Particles (clipped to hero viewport) ─── */
  const heroParticlesCanvas = document.getElementById('heroParticles');
  if (heroParticlesCanvas) {
    const hCtx = heroParticlesCanvas.getContext('2d');
    let heroParticles = [];
    const HERO_PARTICLE_COUNT = 50;

    function resizeHeroParticles() {
      const hero = heroParticlesCanvas.parentElement;
      heroParticlesCanvas.width = hero.offsetWidth;
      heroParticlesCanvas.height = hero.offsetHeight;
    }
    resizeHeroParticles();
    window.addEventListener('resize', resizeHeroParticles);

    const heroColors = [
      [124, 92, 252], [244, 114, 182], [245, 158, 66],
      [200, 180, 255], [255, 200, 220],
    ];

    // Only spawn particles in top portion (visible hero area)
    const spawnH = () => Math.min(heroParticlesCanvas.height, window.innerHeight);

    for (let i = 0; i < HERO_PARTICLE_COUNT; i++) {
      heroParticles.push({
        x: Math.random() * (heroParticlesCanvas.width || 1200),
        y: Math.random() * spawnH(),
        r: 1 + Math.random() * 2,
        speed: 0.15 + Math.random() * 0.35,
        swayAmp: 15 + Math.random() * 25,
        swaySpeed: 0.001 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
        color: heroColors[Math.floor(Math.random() * heroColors.length)],
        opacity: 0.25 + Math.random() * 0.25,
      });
    }

    function drawHeroParticles(time) {
      const maxY = spawnH();
      hCtx.clearRect(0, 0, heroParticlesCanvas.width, heroParticlesCanvas.height);
      heroParticles.forEach(p => {
        p.y -= p.speed;
        const sway = Math.sin(time * p.swaySpeed + p.phase) * p.swayAmp;
        if (p.y < -10) {
          p.y = maxY + 10;
          p.x = Math.random() * heroParticlesCanvas.width;
        }
        // Only draw if within visible hero area
        if (p.y <= maxY + 20) {
          hCtx.globalAlpha = p.opacity;
          hCtx.fillStyle = `rgb(${p.color[0]},${p.color[1]},${p.color[2]})`;
          hCtx.beginPath();
          hCtx.arc(p.x + sway, p.y, p.r, 0, Math.PI * 2);
          hCtx.fill();
        }
      });
      hCtx.globalAlpha = 1;
      requestAnimationFrame(drawHeroParticles);
    }
    requestAnimationFrame(drawHeroParticles);
  }

  /* ─── Hero Mouse-Interactive Glow ─── */
  const heroGlowCanvas = document.getElementById('heroMouseGlow');
  if (heroGlowCanvas) {
    const gCtx = heroGlowCanvas.getContext('2d');
    let mouseX = -999, mouseY = -999;
    let glowX = -999, glowY = -999;
    let mouseActive = false;
    const sparkles = [];

    function resizeGlow() {
      const hero = heroGlowCanvas.parentElement;
      heroGlowCanvas.width = hero.offsetWidth;
      heroGlowCanvas.height = hero.offsetHeight;
    }
    resizeGlow();
    window.addEventListener('resize', resizeGlow);

    const heroSection = heroGlowCanvas.closest('.hero');
    if (heroSection) {
      heroSection.style.pointerEvents = 'auto';
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseActive = true;

        // Spawn sparkles on movement
        if (Math.random() < 0.4) {
          const colors = [[124,92,252],[245,158,66],[244,114,182],[34,211,238]];
          sparkles.push({
            x: mouseX + (Math.random() - 0.5) * 30,
            y: mouseY + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -0.5 - Math.random() * 1.5,
            life: 1,
            decay: 0.015 + Math.random() * 0.02,
            r: 1 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      });
      heroSection.addEventListener('mouseleave', () => {
        mouseActive = false;
      });
    }

    function drawGlow() {
      gCtx.clearRect(0, 0, heroGlowCanvas.width, heroGlowCanvas.height);

      // Smooth follow
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      if (mouseActive || Math.abs(glowX - mouseX) > 2) {
        // Main glow
        const grad = gCtx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 250);
        grad.addColorStop(0, 'rgba(124,92,252,0.08)');
        grad.addColorStop(0.3, 'rgba(244,114,182,0.04)');
        grad.addColorStop(0.6, 'rgba(245,158,66,0.02)');
        grad.addColorStop(1, 'transparent');
        gCtx.fillStyle = grad;
        gCtx.fillRect(0, 0, heroGlowCanvas.width, heroGlowCanvas.height);

        // Inner bright spot
        const innerGrad = gCtx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 60);
        innerGrad.addColorStop(0, 'rgba(255,255,255,0.06)');
        innerGrad.addColorStop(1, 'transparent');
        gCtx.fillStyle = innerGrad;
        gCtx.fillRect(glowX - 60, glowY - 60, 120, 120);
      }

      // Update & draw sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02; // gentle gravity
        s.life -= s.decay;
        if (s.life <= 0) { sparkles.splice(i, 1); continue; }
        gCtx.globalAlpha = s.life * 0.7;
        gCtx.fillStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
        gCtx.beginPath();
        gCtx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        gCtx.fill();
      }
      gCtx.globalAlpha = 1;

      requestAnimationFrame(drawGlow);
    }
    requestAnimationFrame(drawGlow);
  }

  /* ─── Service Card Canvas Animations ─── */
  const svcCanvases = document.querySelectorAll('.svc-canvas');

  const svcThemes = {
    studio: {
      colors: [
        [245, 158, 66], [251, 191, 36], [245, 130, 66],
        [255, 200, 140], [230, 126, 34],
      ],
      init(canvas, ctx) {
        const particles = [];
        const w = canvas.width, h = canvas.height;
        const cx = w / 2, cy = h / 2;
        const COUNT = 180;
        for (let i = 0; i < COUNT; i++) {
          const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.3;
          const dist = 20 + Math.random() * Math.min(w, h) * 0.4;
          particles.push({
            angle,
            dist,
            baseSpeed: 0.0003 + Math.random() * 0.0008,
            r: 0.5 + Math.random() * 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: 0.3 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.001 + Math.random() * 0.002,
          });
        }
        return { particles, cx, cy };
      },
      draw(ctx, w, h, time, state) {
        const { particles, cx, cy } = state;
        ctx.clearRect(0, 0, w, h);
        // Draw connecting curves
        ctx.lineWidth = 0.3;
        for (let i = 0; i < particles.length; i += 3) {
          const p = particles[i];
          const a = p.angle + time * p.baseSpeed;
          const d = p.dist + Math.sin(time * p.pulseSpeed + p.phase) * 15;
          const x = cx + Math.cos(a) * d;
          const y = cy + Math.sin(a) * d;
          const ni = (i + 6) % particles.length;
          const np = particles[ni];
          const na = np.angle + time * np.baseSpeed;
          const nd = np.dist + Math.sin(time * np.pulseSpeed + np.phase) * 15;
          const nx = cx + Math.cos(na) * nd;
          const ny = cy + Math.sin(na) * nd;
          ctx.strokeStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.opacity * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.quadraticCurveTo(cx + Math.sin(time * 0.0005) * 20, cy + Math.cos(time * 0.0005) * 20, nx, ny);
          ctx.stroke();
        }
        // Draw particles
        particles.forEach(p => {
          const a = p.angle + time * p.baseSpeed;
          const d = p.dist + Math.sin(time * p.pulseSpeed + p.phase) * 15;
          const x = cx + Math.cos(a) * d;
          const y = cy + Math.sin(a) * d;
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = `rgb(${p.color[0]},${p.color[1]},${p.color[2]})`;
          ctx.beginPath();
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    },
    launch: {
      colors: [
        [244, 114, 182], [34, 211, 238], [255, 240, 150],
        [236, 72, 153], [100, 220, 240],
      ],
      init(canvas, ctx) {
        const cols = 24, rows = 16;
        const points = [];
        const spacingX = canvas.width / (cols - 1);
        const spacingY = canvas.height / (rows - 1);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            points.push({
              baseX: c * spacingX,
              baseY: r * spacingY,
              col: c, row: r,
              phase: (c + r) * 0.4,
            });
          }
        }
        return { points, cols, rows };
      },
      draw(ctx, w, h, time, state) {
        const { points, cols, rows } = state;
        ctx.clearRect(0, 0, w, h);
        const t = time * 0.001;
        // Calculate displaced positions
        points.forEach(p => {
          const wave = Math.sin(t + p.phase) * 12 + Math.cos(t * 0.7 + p.phase * 0.5) * 8;
          p.x = p.baseX + Math.sin(t * 0.5 + p.col * 0.3) * 6;
          p.y = p.baseY + wave;
        });
        // Draw grid lines
        ctx.lineWidth = 0.5;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const idx = r * cols + c;
            const p1 = points[idx], p2 = points[idx + 1];
            const colorIdx = (r + c) % this.colors.length;
            const col = this.colors[colorIdx];
            ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},0.25)`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows - 1; r++) {
            const idx = r * cols + c;
            const p1 = points[idx], p2 = points[idx + cols];
            const colorIdx = (r + c) % this.colors.length;
            const col = this.colors[colorIdx];
            ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},0.2)`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        // Draw dots at intersections
        points.forEach((p, i) => {
          const col = this.colors[i % this.colors.length];
          ctx.globalAlpha = 0.5 + Math.sin(t + p.phase) * 0.2;
          ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    },
    automate: {
      colors: [
        [124, 92, 252], [155, 89, 182], [199, 21, 133],
        [168, 130, 255], [99, 69, 221],
      ],
      init(canvas, ctx) {
        const NODE_COUNT = 60;
        const nodes = [];
        const w = canvas.width, h = canvas.height;
        for (let i = 0; i < NODE_COUNT; i++) {
          nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: 1.5 + Math.random() * 2.5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            pulse: Math.random() * Math.PI * 2,
          });
        }
        return { nodes };
      },
      draw(ctx, w, h, time, state) {
        const { nodes } = state;
        ctx.clearRect(0, 0, w, h);
        const t = time * 0.001;
        // Update positions
        nodes.forEach(n => {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          n.x = Math.max(0, Math.min(w, n.x));
          n.y = Math.max(0, Math.min(h, n.y));
        });
        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const alpha = (1 - dist / 120) * 0.25;
              const pulse = 0.5 + Math.sin(t + nodes[i].pulse) * 0.5;
              const col = nodes[i].color;
              ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha * pulse})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
        // Draw nodes with glow
        nodes.forEach(n => {
          const pulse = 0.6 + Math.sin(t * 2 + n.pulse) * 0.4;
          ctx.globalAlpha = pulse * 0.15;
          ctx.fillStyle = `rgb(${n.color[0]},${n.color[1]},${n.color[2]})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = pulse;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    },
    agents: {
      colors: [
        [245, 158, 66], [244, 114, 182], [199, 21, 133],
        [255, 105, 180], [236, 72, 153],
      ],
      init(canvas, ctx) {
        const COUNT = 160;
        const particles = [];
        const w = canvas.width, h = canvas.height;
        for (let i = 0; i < COUNT; i++) {
          particles.push({
            angle: Math.random() * Math.PI * 2,
            dist: Math.random() * Math.min(w, h) * 0.45,
            speed: 0.003 + Math.random() * 0.006,
            drift: 0.3 + Math.random() * 0.8,
            r: 0.5 + Math.random() * 2,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: 0.3 + Math.random() * 0.5,
            trail: [],
          });
        }
        return { particles, cx: w / 2, cy: h * 0.55 };
      },
      draw(ctx, w, h, time, state) {
        const { particles, cx, cy } = state;
        ctx.clearRect(0, 0, w, h);
        const t = time * 0.001;
        particles.forEach(p => {
          p.angle += p.speed;
          p.dist += Math.sin(t + p.angle) * 0.2;
          if (p.dist < 5) p.dist = Math.min(w, h) * 0.4;
          if (p.dist > Math.min(w, h) * 0.5) p.dist = 10;
          const spiralX = cx + Math.cos(p.angle) * p.dist;
          const spiralY = cy + Math.sin(p.angle) * p.dist * 0.7 - p.drift;
          p.trail.push({ x: spiralX, y: spiralY });
          if (p.trail.length > 6) p.trail.shift();
          // Draw trail
          if (p.trail.length > 1) {
            ctx.strokeStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.opacity * 0.2})`;
            ctx.lineWidth = p.r * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let k = 1; k < p.trail.length; k++) {
              ctx.lineTo(p.trail[k].x, p.trail[k].y);
            }
            ctx.stroke();
          }
          // Draw particle
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = `rgb(${p.color[0]},${p.color[1]},${p.color[2]})`;
          ctx.beginPath();
          ctx.arc(spiralX, spiralY, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    }
  };

  svcCanvases.forEach(canvas => {
    const theme = canvas.dataset.theme;
    const config = svcThemes[theme];
    if (!config) return;
    const ctx = canvas.getContext('2d');
    let state = null;
    let animating = false;

    function resizeCanvas() {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      state = config.init(canvas, ctx);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function animate(time) {
      if (!animating) return;
      config.draw(ctx, canvas.width, canvas.height, time, state);
      requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animating) {
            animating = true;
            requestAnimationFrame(animate);
          }
        } else {
          animating = false;
        }
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);
  });

  /* ─── Smooth anchor scroll offset for fixed nav ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
