(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isSmall = window.innerWidth < 780;

  /* =========================================================
     Loader
     ========================================================= */
  const loader = document.getElementById('loader');
  const loaderBar = loader ? loader.querySelector('.loader-bar span') : null;

  function hideLoader() {
    if (!loader) return;
    loader.classList.add('is-hidden');
    document.body.classList.add('is-loaded');
    runHeroSequence();
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (loaderBar && window.gsap) {
      gsap.to(loaderBar, { width: '100%', duration: 1.1, ease: 'power2.out' });
    }
    setTimeout(hideLoader, reduceMotion ? 100 : 1200);
  });

  /* =========================================================
     Custom cursor (desktop, non-touch only)
     ========================================================= */
  if (!isTouch) {
    document.body.classList.add('no-touch');
    const cursor = document.getElementById('cursor');
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    const label = cursor.querySelector('.cursor-label');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });

    function raf() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(raf);
    }
    raf();

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-active');
        label.textContent = el.getAttribute('data-cursor') || '';
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-active');
      });
    });
  }

  /* =========================================================
     Hero portrait — subtle mouse parallax (desktop only)
     ========================================================= */
  if (!isTouch && !isSmall && !reduceMotion) {
    const portraitImg = document.querySelector('.portrait-img');
    if (portraitImg) {
      let px = 0, py = 0, ppx = 0, ppy = 0;
      window.addEventListener('mousemove', (e) => {
        px = (e.clientX / window.innerWidth - 0.5) * 2;
        py = (e.clientY / window.innerHeight - 0.5) * 2;
      });
      // wait for the CSS entrance animation to finish before JS takes over transform
      setTimeout(() => {
        (function loop() {
          ppx += (px - ppx) * 0.05;
          ppy += (py - ppy) * 0.05;
          portraitImg.style.transform = `scale(1.1) translate(${ppx * -10}px, ${ppy * -6}px)`;
          requestAnimationFrame(loop);
        })();
      }, 2600);
    }
  }

  /* =========================================================
     Nav: hide on scroll down, show on scroll up
     ========================================================= */
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('nav--scrolled', y > 40);
    if (y > lastY && y > 200) nav.classList.add('nav--hidden');
    else nav.classList.remove('nav--hidden');
    lastY = y;
  }, { passive: true });

  /* =========================================================
     Mobile menu
     ========================================================= */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* =========================================================
     Print resume — wired to every trigger button
     ========================================================= */
  ['printBtnNav', 'printBtnMobile', 'printBtnHero', 'printBtnResume', 'printBtnFooter']
    .forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => window.print());
    });

  /* =========================================================
     Back to top
     ========================================================= */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* =========================================================
     Hero: character-by-character name reveal + staggered lines
     ========================================================= */
  function splitChars(el) {
    const text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';
    text.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.transform = 'translateY(110%) rotate(4deg)';
      span.style.opacity = '0';
      el.appendChild(span);
    });
    return el.querySelectorAll('.char');
  }

  function runHeroSequence() {
    const nameLines = document.querySelectorAll('.reveal-name');
    const titles = document.querySelectorAll('.reveal-title');
    const eyebrow = document.querySelector('.hero-eyebrow');
    const sub = document.querySelector('.hero-sub');
    const cta = document.querySelector('.hero-cta');
    const portrait = document.querySelector('.hero-portrait');
    const cue = document.querySelector('.hero-scroll-cue');

    if (reduceMotion || !window.gsap) {
      [eyebrow, sub, cta, portrait, cue].forEach((el) => el && (el.style.opacity = '1'));
      titles.forEach((t) => { t.style.opacity = '1'; t.style.transform = 'none'; });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to(eyebrow, { opacity: 1, duration: .6 }, 0);

    nameLines.forEach((line, i) => {
      const chars = splitChars(line);
      tl.to(chars, {
        y: 0, rotate: 0, opacity: 1, duration: .9, stagger: 0.028,
        ease: 'power4.out'
      }, 0.15 + i * 0.22);
    });

    tl.to(titles, {
      opacity: 1, y: 0, duration: .7, stagger: 0.12
    }, 0.75);

    tl.to(sub, { opacity: 1, y: 0, duration: .8 }, 1.05);
    tl.to(cta, { opacity: 1, y: 0, duration: .8 }, 1.2);
    tl.to(portrait, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.5);
    tl.to(cue, { opacity: 1, duration: .6 }, 1.6);
  }

  /* =========================================================
     Scroll reveals (IntersectionObserver — sparing, per-section)
     ========================================================= */
  const revealTargets = document.querySelectorAll(
    '.about-headline, .about-body, .about-facts, .project, .timeline-entry, ' +
    '.edu-entry, .skills-tabs, .skills-field, .contact-info, .contact-form, .resume-inner'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((el) => io.observe(el));

  /* =========================================================
     Experience timeline progress
     ========================================================= */
  const timeline = document.querySelector('.timeline');
  const progress = document.querySelector('.timeline-progress');
  if (timeline && progress) {
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      let filled = (vh * 0.7 - rect.top) / total;
      filled = Math.max(0, Math.min(1, filled));
      progress.style.height = (filled * 100) + '%';
    }, { passive: true });
  }

  /* =========================================================
     Skills filter tabs
     ========================================================= */
  const tabs = document.querySelectorAll('.skills-tab');
  const nodes = document.querySelectorAll('.skill-node');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const cat = tab.getAttribute('data-cat');
      nodes.forEach((n) => {
        const show = cat === 'all' || n.getAttribute('data-cat') === cat || n.getAttribute('data-cat') === 'all';
        n.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* =========================================================
     Contact form (Web3Forms)
     ========================================================= */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const accessKey = form.querySelector('[name="access_key"]').value;
      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        status.textContent = 'Form isn\u2019t connected yet — add a Web3Forms access key (see README).';
        status.className = 'form-status is-error';
        return;
      }
      form.classList.add('is-sending');
      status.textContent = '';
      status.className = 'form-status';
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        const data = await res.json();
        if (data.success) {
          status.textContent = 'Message sent — thank you, I\u2019ll get back to you soon.';
          status.className = 'form-status is-success';
          form.reset();
        } else {
          throw new Error(data.message || 'Something went wrong.');
        }
      } catch (err) {
        status.textContent = 'Could not send right now — please email gitarthapratimd@gmail.com directly.';
        status.className = 'form-status is-error';
      } finally {
        form.classList.remove('is-sending');
      }
    });
  }

  /* =========================================================
     Three.js background — wireframe grid + node field
     ========================================================= */
  function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !window.THREE || reduceMotion) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.3 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Node field (points)
    const count = isSmall ? 140 : 420;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0x5eead4, size: 0.028, transparent: true, opacity: 0.55 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // Faint wireframe plane (grid), tilted, drifting slowly
    const gridGeo = new THREE.PlaneGeometry(30, 20, 24, 16);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x2c3a45, wireframe: true, transparent: true, opacity: 0.35 });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = Math.PI / 2.4;
    grid.position.set(0, -3, -4);
    scene.add(grid);

    let targetX = 0, targetY = 0;
    if (!isTouch) {
      window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.015;
      points.rotation.x = t * 0.006;
      grid.rotation.z = Math.sin(t * 0.05) * 0.05;

      camera.position.x += (targetX * 1.1 - camera.position.x) * 0.03;
      camera.position.y += (-targetY * 0.7 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }
  initBackground();

  /* =========================================================
     Footer year
     ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
