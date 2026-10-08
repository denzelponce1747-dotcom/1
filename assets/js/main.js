/* =========================================================
   Hablamos Salud — interacciones y animaciones
   ========================================================= */
(() => {
  'use strict';

  // Enlaces de redes sociales: reemplace con las URL oficiales cuando estén disponibles.
  const SOCIAL = {
    instagram: '',
    facebook: '',
  };
  const EMAIL = 'info@majerie.com';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  /* ---------- Toast ---------- */
  const toastEl = $('.toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2800);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  /* ---------- Social links ---------- */
  $$('[data-social]').forEach((a) => {
    const url = SOCIAL[a.dataset.social];
    if (url) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const name = a.dataset.social === 'instagram' ? 'Instagram' : 'Facebook';
        toast(`Muy pronto en ${name}. Mientras tanto: ${EMAIL}`);
      });
    }
  });

  /* ---------- Copy email ---------- */
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const ok = await copyText(b.dataset.copy);
    toast(ok ? '¡Correo copiado!' : EMAIL);
  }));

  /* ---------- Year ---------- */
  $$('.year').forEach((y) => { y.textContent = new Date().getFullYear(); });

  /* ---------- Citations tooltip ---------- */
  const tip = document.createElement('div');
  tip.className = 'cite-tip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);
  $$('.cite').forEach((c) => {
    const ref = $(c.getAttribute('href'));
    if (!ref) return;
    const show = () => {
      tip.innerHTML = ref.innerHTML;
      const r = c.getBoundingClientRect();
      tip.classList.add('is-on');
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      let x = Math.min(Math.max(16, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 16);
      let y = r.top - th - 12;
      if (y < 12) y = r.bottom + 12;
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
    };
    const hide = () => tip.classList.remove('is-on');
    if (finePointer) {
      c.addEventListener('mouseenter', show);
      c.addEventListener('mouseleave', hide);
    }
    c.addEventListener('focus', show);
    c.addEventListener('blur', hide);
  });
  window.addEventListener('scroll', () => tip.classList.remove('is-on'), { passive: true });

  /* ---------- Symbol interaction ---------- */
  const symbolSvg = $('.iso--symbol');
  const meaningItems = $$('.meaning li');
  function setArm(arm) {
    if (!symbolSvg) return;
    symbolSvg.classList.toggle('has-active', !!arm);
    $$('.iso__arm', symbolSvg).forEach((g) => g.classList.toggle('is-active', g.dataset.arm === arm));
    meaningItems.forEach((li) => li.classList.toggle('is-active', li.dataset.arm === arm));
  }
  if (symbolSvg) {
    $$('.iso__arm', symbolSvg).forEach((g) => {
      g.addEventListener('mouseenter', () => setArm(g.dataset.arm));
      g.addEventListener('focus', () => setArm(g.dataset.arm));
      g.addEventListener('click', () => setArm(g.dataset.arm));
    });
    symbolSvg.addEventListener('mouseleave', () => setArm(null));
    meaningItems.forEach((li) => {
      li.addEventListener('mouseenter', () => setArm(li.dataset.arm));
      li.addEventListener('click', () => setArm(li.dataset.arm));
    });
    $('.meaning')?.addEventListener('mouseleave', () => setArm(null));
  }

  /* ---------- Compare toggle ---------- */
  const seg = $('.seg');
  const rows = $('.compare__rows');
  function placePill() {
    const active = $('.seg__btn.is-active', seg);
    const pill = $('.seg__pill', seg);
    pill.style.width = `${active.offsetWidth}px`;
    pill.style.transform = `translateX(${active.offsetLeft - 6}px)`;
    pill.style.background = active.dataset.mode === 'promo' ? 'var(--mint)' : 'var(--sky)';
    active.style.color = active.dataset.mode === 'promo' ? 'var(--ink)' : 'var(--white)';
  }
  if (seg) {
    placePill();
    window.addEventListener('resize', placePill);
    $$('.seg__btn', seg).forEach((btn) => btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      $$('.seg__btn', seg).forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn);
        b.style.color = '';
      });
      placePill();
      const mode = btn.dataset.mode;
      rows.dataset.mode = mode;
      const dds = $$('dd', rows);
      const swap = () => dds.forEach((dd) => { dd.textContent = dd.dataset[mode]; });
      if (hasGSAP && !reduce) {
        gsap.timeline()
          .to(dds, { yPercent: -40, opacity: 0, duration: .25, stagger: .03, ease: 'power2.in' })
          .add(swap)
          .fromTo(dds, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, stagger: .05, ease: 'power3.out' });
      } else swap();
    }));
  }

  /* ---------- Ottawa areas ---------- */
  const AREAS = [
    {
      c: 'var(--coral)', title: 'Construir políticas públicas saludables',
      text: 'Poner la salud en la agenda de quienes toman decisiones en todos los sectores —no solo en salud— mediante leyes, regulaciones, incentivos y cambios organizacionales.',
      ex: 'La Ley N.° 9028 de Costa Rica (2012) declaró espacios libres de humo de tabaco en lugares públicos y de trabajo, protegiendo a toda la población.',
    },
    {
      c: 'var(--sun)', title: 'Crear entornos que apoyen la salud',
      text: 'Lograr que los lugares donde vivimos, estudiamos, trabajamos y nos divertimos sean seguros, estimulantes y agradables, y que la opción saludable esté al alcance.',
      ex: 'Una oficina con pausas activas, agua potable accesible, opciones saludables en el comedor y espacios para descansar la mente.',
    },
    {
      c: 'var(--mint)', title: 'Reforzar la acción comunitaria',
      text: 'Que las comunidades fijen sus prioridades, tomen decisiones y ejecuten acciones para mejorar su salud. La participación es el motor del cambio.',
      ex: 'Vecinos que, junto con la municipalidad, recuperan un parque, organizan grupos de caminata y una feria de salud anual.',
    },
    {
      c: 'var(--sky)', title: 'Desarrollar aptitudes personales',
      text: 'Brindar información, educación para la salud y habilidades para la vida, de modo que las personas puedan tomar decisiones informadas sobre su salud y su entorno.',
      ex: 'Talleres para leer etiquetas nutricionales, manejar el estrés o cuidar la salud mental, con materiales claros y adaptados al público.',
    },
    {
      c: '#7E8A98', title: 'Reorientar los servicios de salud',
      text: 'Que los servicios vayan más allá de curar: que prevengan, eduquen y se conecten con otros sectores, con un enfoque integral y centrado en las personas.',
      ex: 'Los EBAIS de Costa Rica: equipos de atención primaria con población asignada que integran prevención, promoción y visitas comunitarias.',
    },
  ];
  const areaPanel = $('.areas__panel');
  function renderArea(i, animate) {
    const a = AREAS[i];
    const card = $('.area-card', areaPanel);
    const fill = () => {
      card.style.setProperty('--ac', a.c);
      $('.area-card__big', card).textContent = String(i + 1).padStart(2, '0');
      $('.area-card__title', card).textContent = a.title;
      $('.area-card__text', card).textContent = a.text;
      $('.area-card__ex p', card).textContent = a.ex;
    };
    if (animate && hasGSAP && !reduce) {
      const parts = [$('.area-card__title', card), $('.area-card__text', card), $('.area-card__ex', card)];
      gsap.timeline()
        .to(parts, { y: -16, opacity: 0, duration: .22, stagger: .04, ease: 'power2.in' })
        .to($('.area-card__big', card), { y: 60, opacity: 0, duration: .25 }, 0)
        .add(fill)
        .fromTo(parts, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .06, ease: 'power3.out' })
        .fromTo($('.area-card__big', card), { y: 80, opacity: 0 }, { y: 0, opacity: .55, duration: .8, ease: 'power3.out' }, '<');
    } else fill();
  }
  $$('.area-tab').forEach((t) => t.addEventListener('click', () => {
    if (t.classList.contains('is-active')) return;
    $$('.area-tab').forEach((x) => { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', x === t); });
    renderArea(+t.dataset.i, true);
  }));
  if (areaPanel) renderArea(0, false);

  /* ---------- Determinants rainbow ---------- */
  const DETS = {
    1: { tag: 'Núcleo', title: 'Edad, sexo y factores hereditarios', text: 'Lo que no podemos cambiar. Aun así, influye en cómo nos afectan las demás capas: por eso las acciones deben adaptarse a cada etapa de la vida.', c: '#1F262E' },
    2: { tag: 'Capa 2', title: 'Estilos de vida individuales', text: 'Alimentación, actividad física, sueño, consumo de tabaco y alcohol. Importan, pero no dependen solo de la voluntad: se moldean por las capas externas.', c: '#FD694D' },
    3: { tag: 'Capa 3', title: 'Redes sociales y comunitarias', text: 'Familia, amistades, vecindario y grupos de pertenencia. El apoyo social protege la salud tanto como otros factores clásicos de riesgo.', c: '#F7BB02' },
    4: { tag: 'Capa 4', title: 'Condiciones de vida y de trabajo', text: 'Educación, empleo y ambiente laboral, vivienda, agua y saneamiento, alimentos disponibles y acceso a servicios de salud.', c: '#09CE86' },
    5: { tag: 'Capa 5', title: 'Condiciones socioeconómicas, culturales y ambientales', text: 'Economía, políticas públicas, normas culturales y el ambiente. Las decisiones a esta escala afectan a poblaciones enteras.', c: '#0079FD' },
  };
  const rainbow = $('.rainbow');
  const detsInfo = $('.dets__info');
  function setLayer(n, user) {
    const d = DETS[n];
    if (!d) return;
    $$('.rb', rainbow).forEach((g) => g.classList.toggle('is-active', g.dataset.layer === String(n)));
    if (user) rainbow.classList.add('has-active');
    detsInfo.style.setProperty('--dc', d.c);
    const parts = [$('.dets__tag', detsInfo), $('.dets__title', detsInfo), $('.dets__text', detsInfo)];
    const fill = () => {
      parts[0].textContent = d.tag;
      parts[1].textContent = d.title;
      parts[2].textContent = d.text;
    };
    if (hasGSAP && !reduce && user) {
      gsap.killTweensOf(parts);
      gsap.timeline().to(parts, { opacity: 0, x: -10, duration: .15, stagger: .02 }).add(fill).to(parts, { opacity: 1, x: 0, duration: .4, stagger: .05, ease: 'power3.out' });
    } else fill();
  }
  if (rainbow) {
    let current = '2';
    $$('.rb', rainbow).forEach((g) => {
      const on = () => { if (current !== g.dataset.layer) { current = g.dataset.layer; setLayer(current, true); } else rainbow.classList.add('has-active'); };
      g.addEventListener('mouseenter', on);
      g.addEventListener('click', on);
      g.addEventListener('focus', on);
    });
    rainbow.addEventListener('mouseleave', () => rainbow.classList.remove('has-active'));
  }

  /* ---------- Flip cards ---------- */
  $$('.stat').forEach((s) => s.addEventListener('click', () => {
    const on = s.classList.toggle('is-flipped');
    s.setAttribute('aria-pressed', on);
  }));

  /* ---------- Accordion ---------- */
  $$('.acc__item').forEach((item) => {
    const q = $('.acc__q', item);
    const a = $('.acc__a', item);
    q.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      $$('.acc__item.is-open').forEach((o) => {
        if (o === item) return;
        o.classList.remove('is-open');
        $('.acc__q', o).setAttribute('aria-expanded', 'false');
        const oa = $('.acc__a', o);
        if (hasGSAP) gsap.to(oa, { height: 0, duration: .5, ease: 'power3.inOut' }); else oa.style.height = '0';
      });
      item.classList.toggle('is-open', open);
      q.setAttribute('aria-expanded', open);
      if (hasGSAP) {
        gsap.to(a, { height: open ? 'auto' : 0, duration: .6, ease: 'power3.inOut', onComplete: () => window.lenis?.resize() });
      } else a.style.height = open ? 'auto' : '0';
    });
  });

  /* ---------- Contact form ---------- */
  const form = $('.form');
  const done = $('.form__done', form);
  let lastMail = { subject: '', body: '' };
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  function buildMail(data) {
    const subject = `Consulta desde la web${data.org ? ` · ${data.org}` : ''} · ${data.name}`;
    const lines = [
      'Hola, equipo de Hablamos Salud:',
      '',
      data.message,
      '',
    ];
    if (data.interests.length) lines.push(`Me interesa: ${data.interests.join(', ')}`, '');
    lines.push('—', `Nombre: ${data.name}`, `Correo: ${data.email}`);
    if (data.org) lines.push(`Organización: ${data.org}`);
    return { subject, body: lines.join('\n') };
  }

  function confetti() {
    if (reduce) return;
    const cv = document.createElement('canvas');
    cv.className = 'confetti';
    form.appendChild(cv);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = form.offsetWidth;
    const h = form.offsetHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    cv.style.width = `${w}px`; cv.style.height = `${h}px`;
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);
    const colors = ['#FD694D', '#F7BB02', '#09CE86', '#0079FD'];
    const parts = Array.from({ length: 120 }, () => ({
      x: w / 2, y: h * .38, r: 3 + Math.random() * 5,
      vx: (Math.random() - .5) * 13, vy: -Math.random() * 12 - 3,
      c: colors[(Math.random() * 4) | 0], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, round: Math.random() > .5,
    }));
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        p.vy += .32; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); } else ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
      });
      if (++frame < 150) requestAnimationFrame(tick); else cv.remove();
    })();
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const data = {
        name: (f.get('name') || '').toString().trim(),
        email: (f.get('email') || '').toString().trim(),
        org: (f.get('org') || '').toString().trim(),
        message: (f.get('message') || '').toString().trim(),
        interests: f.getAll('interest').map(String),
      };
      const checks = [
        ['name', data.name.length > 1],
        ['email', isEmail(data.email)],
        ['message', data.message.length > 2],
      ];
      let firstBad = null;
      checks.forEach(([name, ok]) => {
        const field = form.elements[name].closest('.field');
        field.classList.toggle('is-error', !ok);
        if (!ok && !firstBad) firstBad = form.elements[name];
      });
      if (firstBad) {
        firstBad.focus();
        if (hasGSAP) gsap.fromTo(firstBad.closest('.field'), { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' });
        return;
      }
      lastMail = buildMail(data);
      const q = `subject=${encodeURIComponent(lastMail.subject)}&body=${encodeURIComponent(lastMail.body)}`;
      $('[data-alt="gmail"]', done).href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(lastMail.subject)}&body=${encodeURIComponent(lastMail.body)}`;
      $('[data-alt="outlook"]', done).href = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(EMAIL)}&${q}`;
      window.location.href = `mailto:${EMAIL}?${q}`;

      done.classList.add('is-on');
      done.setAttribute('aria-hidden', 'false');
      if (hasGSAP) {
        const path = $('.form__check path', done);
        const circle = $('.form__check circle', done);
        [path, circle].forEach((el) => { const l = el.getTotalLength(); el.style.strokeDasharray = l; el.style.strokeDashoffset = l; });
        gsap.timeline()
          .fromTo(done, { opacity: 0, clipPath: 'circle(0% at 50% 90%)' }, { opacity: 1, clipPath: 'circle(150% at 50% 90%)', duration: .9, ease: 'power3.inOut' })
          .to(circle, { strokeDashoffset: 0, duration: .7, ease: 'power2.out' }, '-=.3')
          .to(path, { strokeDashoffset: 0, duration: .5, ease: 'power2.out' }, '-=.25')
          .from($$('h3, p, .form__alt, .form__again', done), { y: 16, opacity: 0, stagger: .07, duration: .5, ease: 'power3.out' }, '-=.4');
      } else done.style.opacity = 1;
      confetti();
    });
    $$('input, textarea', form).forEach((el) => el.addEventListener('input', () => el.closest('.field')?.classList.remove('is-error')));
    $('[data-alt="copy"]', done).addEventListener('click', async () => {
      const ok = await copyText(`Para: ${EMAIL}\nAsunto: ${lastMail.subject}\n\n${lastMail.body}`);
      toast(ok ? 'Mensaje copiado. Péguelo en su correo.' : 'No se pudo copiar');
    });
    $('.form__again', done).addEventListener('click', () => {
      form.reset();
      const hide = () => { done.classList.remove('is-on'); done.setAttribute('aria-hidden', 'true'); };
      if (hasGSAP) gsap.to(done, { opacity: 0, duration: .4, onComplete: hide }); else hide();
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = $('.nav__burger');
  const menu = $('#menu');
  let menuOpen = false;
  function toggleMenu(force) {
    menuOpen = typeof force === 'boolean' ? force : !menuOpen;
    burger.setAttribute('aria-expanded', menuOpen);
    burger.setAttribute('aria-label', menuOpen ? 'Cerrar menú' : 'Abrir menú');
    menu.setAttribute('aria-hidden', !menuOpen);
    document.documentElement.classList.toggle('menu-open', menuOpen);
    const nav = $('.nav');
    if (menuOpen) { nav.dataset.prevTheme = nav.dataset.navTheme; nav.dataset.navTheme = 'dark'; window.lenis?.stop(); }
    else { if (nav.dataset.prevTheme) nav.dataset.navTheme = nav.dataset.prevTheme; window.lenis?.start(); }
    if (!hasGSAP) { menu.classList.toggle('is-open', menuOpen); $('.menu__inner', menu).style.clipPath = menuOpen ? 'none' : ''; return; }
    const bars = $$('.menu__bars span', menu);
    const inner = $('.menu__inner', menu);
    const links = $$('.menu__links a, .menu__foot > *', menu);
    gsap.killTweensOf([bars, inner, links]);
    if (menuOpen) {
      menu.classList.add('is-open');
      gsap.timeline()
        .set(bars, { transformOrigin: 'top' })
        .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: .5, stagger: .06, ease: 'power3.inOut' })
        .fromTo(inner, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .6, ease: 'power3.inOut' }, '-=.2')
        .fromTo(links, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: 'power3.out' }, '-=.25');
    } else {
      gsap.timeline({ onComplete: () => menu.classList.remove('is-open') })
        .to(inner, { clipPath: 'inset(0 0 100% 0)', duration: .5, ease: 'power3.inOut' })
        .set(bars, { transformOrigin: 'bottom' })
        .to(bars, { scaleY: 0, duration: .45, stagger: .05, ease: 'power3.inOut' }, '-=.15');
    }
  }
  burger?.addEventListener('click', () => toggleMenu());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) toggleMenu(false); });

  /* ---------- Anchor scrolling ---------- */
  function scrollToTarget(target) {
    if (!target) return;
    if (window.lenis) window.lenis.scrollTo(target, { offset: target.id === 'inicio' ? 0 : -20, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#' || a.dataset.social) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    if (menuOpen) toggleMenu(false);
    if (target.matches('.reflist li')) {
      target.classList.remove('is-flash');
      void target.offsetWidth;
      target.classList.add('is-flash');
    }
    setTimeout(() => scrollToTarget(target), menuOpen ? 450 : 0);
    history.replaceState(null, '', id);
  });
  $('.totop')?.addEventListener('click', () => scrollToTarget($('#inicio')));

  /* =========================================================
     Without GSAP: finish here
     ========================================================= */
  if (!hasGSAP) {
    $('.loader')?.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  /* ---------- Smooth scroll ---------- */
  if (!reduce && typeof window.Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: .1, smoothWheel: true, wheelMultiplier: 1 });
    window.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Draw helper ---------- */
  function prepDraw(paths) {
    paths.forEach((p) => {
      const l = p.getTotalLength();
      p.style.strokeDasharray = `${l} ${l}`;
      p.style.strokeDashoffset = l;
    });
  }

  /* ---------- Nav: theme, hide, active link ---------- */
  const nav = $('.nav');
  $$('[data-theme]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 44px', end: 'bottom 44px',
      onToggle: (self) => { if (self.isActive && !menuOpen) nav.dataset.navTheme = sec.dataset.theme; },
    });
  });
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 30);
      if (!menuOpen) nav.classList.toggle('is-hidden', y > 400 && y > lastY + 2);
      if (y < lastY - 2) nav.classList.remove('is-hidden');
      lastY = y;
      gsap.set('.progress__bar', { scaleX: self.progress });
    },
  });
  const indicator = $('.nav__indicator');
  const navColors = { nosotros: 'var(--coral)', servicios: 'var(--sun)', promocion: 'var(--mint)', evidencia: 'var(--sky)', faq: 'var(--coral)' };
  function moveIndicator(link) {
    $$('.nav__links a').forEach((a) => a.classList.toggle('is-active', a === link));
    if (!link) { indicator.style.opacity = 0; return; }
    indicator.style.opacity = 1;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    indicator.style.setProperty('--ind', navColors[link.dataset.link]);
  }
  Object.keys(navColors).forEach((id) => {
    const sec = $(`#${id}`);
    const link = $(`.nav__links a[data-link="${id}"]`);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => { if (self.isActive) moveIndicator(link); else if ($('.nav__links a.is-active') === link) moveIndicator(null); },
    });
  });

  /* ---------- Cursor ---------- */
  if (finePointer && !reduce) {
    const cur = $('.cursor');
    const dot = $('.cursor__dot');
    const ring = $('.cursor__ring');
    const label = $('.cursor__label');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { ...pos };
    const xDot = gsap.quickSetter(dot, 'x', 'px');
    const yDot = gsap.quickSetter(dot, 'y', 'px');
    const xRing = gsap.quickSetter(ring, 'x', 'px');
    const yRing = gsap.quickSetter(ring, 'y', 'px');
    window.addEventListener('mousemove', (e) => {
      pos.x = e.clientX; pos.y = e.clientY; xDot(pos.x); yDot(pos.y);
      if (!cur.classList.contains('is-ready')) { ringPos.x = pos.x; ringPos.y = pos.y; cur.classList.add('is-ready'); }
    }, { passive: true });
    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * .18;
      ringPos.y += (pos.y - ringPos.y) * .18;
      xRing(ringPos.x); yRing(ringPos.y);
    });
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('a, button, [data-cursor], .rb, .iso--symbol .iso__arm, .meaning li, .chips label, input, textarea');
      const lab = e.target.closest('[data-cursor]');
      cur.classList.toggle('is-hover', !!el && !lab);
      cur.classList.toggle('is-label', !!lab);
      label.textContent = lab ? lab.dataset.cursor : '';
    });
    document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cur.classList.remove('is-hidden'));
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduce) {
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .3);
        yTo((e.clientY - r.top - r.height / 2) * .35);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Tilt cards ---------- */
  if (finePointer && !reduce) {
    $$('[data-tilt]').forEach((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: .6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: .6, ease: 'power3.out' });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry((px - .5) * 14);
        rx((.5 - py) * 12);
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => { rx(0); ry(0); });
    });
  }

  if (reduce) {
    $('.loader')?.remove();
    gsap.set('.progress__bar', { scaleX: 0 });
    return;
  }

  /* =========================================================
     Intro: loader → hero
     ========================================================= */
  const loader = $('.loader');
  const loaderStrokes = $$('.iso--loader .iso__stroke');
  const loaderHeads = $$('.iso--loader .iso__head');
  const heroStrokes = $$('.iso--hero .iso__stroke');
  const heroHeads = $$('.iso--hero .iso__head');
  prepDraw(loaderStrokes);
  prepDraw(heroStrokes);
  gsap.set([loaderHeads, heroHeads], { scale: 0, transformOrigin: '50% 50%' });
  gsap.set('.hero__title .line__in', { yPercent: 115 });
  gsap.set(['.hero__eyebrow', '.hero__lead', '.hero__ctas > *', '.hero__meta li', '.scroll-cue'], { y: 30, opacity: 0 });
  gsap.set('.chip', { scale: 0, opacity: 0 });
  gsap.set('.iso--glow', { opacity: 0 });
  gsap.set('.hero__halo', { scale: .6, opacity: 0 });
  gsap.set('.loader__panels span', { y: 0, yPercent: 101 });
  gsap.set('.nav', { yPercent: -160 });
  window.lenis?.stop();

  const counter = { v: 0 };
  const num = $('.loader__num');
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .to(loaderStrokes, { strokeDashoffset: 0, duration: 1.1, stagger: .14, ease: 'power2.inOut' })
    .to(loaderHeads, { scale: 1, duration: .6, stagger: .1, ease: 'back.out(3)' }, '-=.5')
    .to(counter, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => { num.textContent = Math.round(counter.v); } }, 0)
    .to('.loader__panels span', { yPercent: 0, duration: .7, stagger: .08, ease: 'power3.inOut' }, '+=.1')
    .set('.loader__inner', { opacity: 0 })
    .set(loader, { backgroundColor: 'transparent' })
    .to('.loader__panels span', { yPercent: -101, duration: .8, stagger: .08, ease: 'power3.inOut' })
    .add(() => { loader.remove(); window.lenis?.start(); ScrollTrigger.refresh(); })
    .to('.hero__title .line__in', { yPercent: 0, duration: 1.2, stagger: .1, ease: 'expo.out' }, '-=.75')
    .to('.hero__eyebrow', { y: 0, opacity: 1, duration: .8 }, '<')
    .to('.hero__halo', { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' }, '<')
    .to(heroStrokes, { strokeDashoffset: 0, duration: 1.4, stagger: .12, ease: 'power3.inOut' }, '<.1')
    .to(heroHeads, { scale: 1, duration: .8, stagger: .1, ease: 'back.out(2.6)' }, '-=.7')
    .to('.iso--glow', { opacity: .55, duration: 1.2 }, '-=.8')
    .to('.hero__lead', { y: 0, opacity: 1, duration: .9 }, '-=1.4')
    .to('.hero__ctas > *', { y: 0, opacity: 1, duration: .8, stagger: .08 }, '-=1.1')
    .to('.hero__meta li', { y: 0, opacity: 1, duration: .8, stagger: .08 }, '-=.9')
    .to('.chip', { scale: 1, opacity: 1, duration: .7, stagger: .08, ease: 'back.out(2)' }, '-=1')
    .to('.scroll-cue', { y: 0, opacity: 1, duration: .8 }, '-=.6')
    .to('.nav', { yPercent: 0, duration: 1, ease: 'expo.out', clearProps: 'transform' }, '-=1.6')
    .add(heroIdle);

  /* ---------- Hero idle + parallax ---------- */
  function heroIdle() {
    const dirs = { y: [0, -60], c: [-60, 0], g: [60, 0], b: [0, 60] };
    $$('.iso--hero .iso__arm').forEach((g, i) => {
      const [x, y] = dirs[g.dataset.arm];
      gsap.to(g, { x, y, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * .25 });
    });
  }
  if (finePointer) {
    const vis = $('.hero__visual');
    const isoH = $('.iso--hero');
    const glow = $('.iso--glow');
    const chips = $$('.chip');
    const rX = gsap.quickTo(isoH, 'rotationX', { duration: 1, ease: 'power3.out' });
    const rY = gsap.quickTo(isoH, 'rotationY', { duration: 1, ease: 'power3.out' });
    const gX = gsap.quickTo(glow, 'x', { duration: 1.4, ease: 'power3.out' });
    const gY = gsap.quickTo(glow, 'y', { duration: 1.4, ease: 'power3.out' });
    const chipTo = chips.map((c, i) => ({ x: gsap.quickTo(c, 'x', { duration: 1.2 + i * .1, ease: 'power3.out' }), y: gsap.quickTo(c, 'y', { duration: 1.2 + i * .1, ease: 'power3.out' }), d: (i % 2 ? -1 : 1) * (14 + i * 5) }));
    $('.hero').addEventListener('mousemove', (e) => {
      const r = vis.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / innerWidth;
      const py = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      rY(px * 26); rX(-py * 22);
      gX(px * 40); gY(py * 40);
      chipTo.forEach((c) => { c.x(px * c.d); c.y(py * c.d); });
    });
  }

  /* ---------- Hero scroll-out ---------- */
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .to('.hero__copy', { y: -120, opacity: .2, ease: 'none' }, 0)
    .to('.hero__visual', { y: 120, scale: 1.15, ease: 'none' }, 0)
    .to('.chip', { opacity: 0, ease: 'none' }, 0);

  /* ---------- Marquee (velocity-reactive) ---------- */
  const mTrack = $('.marquee__track');
  if (mTrack) {
    const loop = gsap.to(mTrack, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    let dir = 1;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const v = self.getVelocity();
        if (Math.abs(v) > 10) dir = v > 0 ? 1 : -1;
        gsap.to(loop, { timeScale: dir * Math.min(1 + Math.abs(v) / 300, 6), duration: .25, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: .25 });
      },
    });
  }

  /* ---------- Split headings ---------- */
  if (window.SplitText) {
    document.fonts.ready.then(() => {
      $$('.split').forEach((h) => {
        const st = new SplitText(h, { type: 'lines,words', linesClass: 'split-line', wordsClass: 'split-word' });
        gsap.from(st.words, {
          yPercent: 110, rotate: 4, duration: 1.1, stagger: .06, ease: 'expo.out',
          scrollTrigger: { trigger: h, start: 'top 85%' },
        });
      });
      ScrollTrigger.refresh();
    });
  }

  /* ---------- Word-by-word light-up ---------- */
  $$('[data-words]').forEach((p) => {
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const s = document.createElement('span');
            s.className = 'word';
            s.textContent = part;
            frag.appendChild(s);
            words.push(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(p);
    gsap.fromTo(words, { opacity: .14 }, {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 45%', scrub: .6 },
    });
  });

  /* ---------- Generic reveals ---------- */
  gsap.set('[data-reveal]', { opacity: 0, y: 60 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1.1, stagger: .1, ease: 'expo.out', overwrite: true }),
  });

  /* ---------- Decorative strokes ---------- */
  $$('.deco').forEach((svg) => {
    const p = $('.draw', svg);
    const d = $('.draw-dot', svg);
    prepDraw([p]);
    gsap.set(d, { scale: 0, transformOrigin: '50% 50%' });
    gsap.timeline({ scrollTrigger: { trigger: svg.parentElement, start: 'top 75%', end: 'top 5%', scrub: 1 } })
      .to(p, { strokeDashoffset: 0, ease: 'none' })
      .to(d, { scale: 1, ease: 'back.out(3)', duration: .2 }, '-=.15');
  });

  /* ---------- Symbol isotipo draw ---------- */
  const symStrokes = $$('.iso--symbol .iso__stroke');
  prepDraw(symStrokes);
  gsap.set('.iso--symbol .iso__head', { scale: 0, transformOrigin: '50% 50%' });
  gsap.timeline({ scrollTrigger: { trigger: '.symbol', start: 'top 70%' } })
    .to(symStrokes, { strokeDashoffset: 0, duration: 1.4, stagger: .15, ease: 'power3.inOut' })
    .to('.iso--symbol .iso__head', { scale: 1, duration: .6, stagger: .1, ease: 'back.out(3)' }, '-=.6')
    .from('.meaning li', { x: 40, opacity: 0, duration: .8, stagger: .1, ease: 'expo.out' }, 0.3);

  /* ---------- Services horizontal ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1001px)', () => {
    const track = $('.services__track');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.services', pin: '.services__pin', start: 'top top', end: () => `+=${dist()}`, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 1 },
    });
    $$('.svc', track).forEach((card, i) => {
      gsap.from(card, {
        y: 80, rotate: i % 2 ? 4 : -4, opacity: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%' },
      });
    });
    return () => gsap.set(track, { x: 0 });
  });
  mm.add('(max-width: 1000px)', () => {
    gsap.from('.svc', { y: 60, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.services__track', start: 'top 85%' } });
  });

  /* ---------- Quote mark ---------- */
  gsap.from('.quote__mark', { scale: 0, rotate: -30, duration: 1.2, ease: 'back.out(2)', scrollTrigger: { trigger: '.quote', start: 'top 80%' } });

  /* ---------- Compare rows ---------- */
  gsap.from('.compare__rows .row', { x: -30, opacity: 0, duration: .9, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.compare__rows', start: 'top 85%' } });

  /* ---------- Areas tabs ---------- */
  gsap.from('.area-tab', { x: -40, opacity: 0, duration: .9, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: '.areas__ui', start: 'top 80%' } });
  gsap.from('.area-card', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.areas__ui', start: 'top 80%' } });

  /* ---------- Rainbow ---------- */
  if (rainbow) {
    gsap.from($$('.rb', rainbow).reverse(), {
      scale: 0, svgOrigin: '300 305', duration: 1.2, stagger: .12, ease: 'expo.out',
      scrollTrigger: { trigger: rainbow, start: 'top 80%' },
      onComplete: () => gsap.set('.rb', { clearProps: 'transform' }),
    });
  }

  /* ---------- Salutogenesis strike ---------- */
  gsap.to('.strike', { '--s': 1, duration: .9, ease: 'power3.inOut', scrollTrigger: { trigger: '.saluto', start: 'top 65%' } });
  gsap.from('.soc li', { y: 40, opacity: 0, duration: .9, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.soc', start: 'top 88%' } });

  /* ---------- Timeline ---------- */
  gsap.to('.tl__fill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 60%', end: 'bottom 60%', scrub: .5 } });
  $$('.tl__item').forEach((item, i) => {
    const year = $('.tl__year', item);
    const card = $('.tl__card', item);
    const fromLeft = innerWidth > 760 && i % 2 === 1;
    gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 72%', onEnter: () => item.classList.add('is-on'), onLeaveBack: () => item.classList.remove('is-on') } })
      .from(year, { x: innerWidth > 760 ? (fromLeft ? -60 : 60) : 0, y: innerWidth > 760 ? 0 : 20, opacity: 0, duration: 1, ease: 'expo.out' })
      .from(card, { x: innerWidth > 760 ? (fromLeft ? 60 : -60) : 0, y: innerWidth > 760 ? 0 : 30, opacity: 0, duration: 1, ease: 'expo.out' }, '<.08');
  });

  /* ---------- Counters ---------- */
  $$('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const obj = { v: 0 };
    const fmt = (v) => v.toFixed(dec).replace('.', ',');
    el.textContent = fmt(0);
    const inHero = el.closest('.hero');
    gsap.to(obj, {
      v: end, duration: inHero ? 2 : 2.2, ease: 'power3.out', delay: inHero ? 3.6 : 0,
      onUpdate: () => { el.textContent = fmt(obj.v); },
      scrollTrigger: inHero ? undefined : { trigger: el, start: 'top 90%' },
    });
  });

  /* ---------- Evidence cards ---------- */
  gsap.set('.stat', { opacity: 0, y: 80, rotateX: -25, transformPerspective: 900 });
  ScrollTrigger.batch('.stat', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.to(els, { y: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: .08, ease: 'expo.out', overwrite: true }),
  });

  /* ---------- Process path ---------- */
  const stepsPath = $('.steps__path');
  if (stepsPath) {
    prepDraw([stepsPath]);
    gsap.to(stepsPath, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'top 30%', scrub: 1 } });
  }

  /* ---------- Contact title ---------- */
  gsap.from('.contact__title .line__in', { yPercent: 115, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 65%' } });
  gsap.from('.form', { y: 80, opacity: 0, rotate: 2, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.contact', start: 'top 60%' } });

  /* ---------- Reference list ---------- */
  gsap.from('.reflist li', { y: 20, opacity: 0, duration: .7, stagger: .03, ease: 'power3.out', scrollTrigger: { trigger: '.reflist', start: 'top 85%' } });

  /* ---------- Footer giant ---------- */
  gsap.from('.footer__giant span', { yPercent: 100, opacity: 0, duration: 1.4, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.footer__giant', start: 'top 95%' } });

  /* ---------- Refresh after assets ---------- */
  ScrollTrigger.sort();
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
