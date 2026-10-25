// ============================
// CAMADA DE ANIMAÇÕES — MOTION (motion.dev)
// Requer vendor/motion.js carregado antes (expõe window.Motion).
// ============================

(function () {
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const M = window.Motion;
  const motionAtivo = Boolean(M) && !reduzMovimento;

  const molaSuave = { type: 'spring', stiffness: 140, damping: 20, mass: 0.9 };
  const easeSaida = [0.16, 1, 0.3, 1];

  // ============================
  // FOTO REAL ⇄ CARICATURA
  // ============================
  function iniciarRetrato() {
    const retrato = document.getElementById('heroPortrait');
    if (!retrato) return;

    const card = retrato.querySelector('.portrait-card');
    const thumb = retrato.querySelector('.portrait-switch-thumb');
    const botoes = retrato.querySelectorAll('.portrait-switch button');
    let modoDev = false;
    let tilt = { x: 0, y: 0 };

    function aplicar(dev) {
      modoDev = dev;
      retrato.classList.toggle('is-dev', dev);
      card.setAttribute('aria-pressed', String(dev));
      botoes.forEach(botao => {
        botao.setAttribute('aria-pressed', String((botao.dataset.view === 'dev') === dev));
      });

      const rotacao = { rotateY: (dev ? 180 : 0) + tilt.y, rotateX: tilt.x };
      if (motionAtivo) {
        M.animate(card, rotacao, { type: 'spring', stiffness: 90, damping: 14, mass: 1 });
        M.animate(thumb, { x: dev ? '100%' : '0%' }, { type: 'spring', stiffness: 380, damping: 32 });
      } else {
        card.style.transform = `rotateY(${dev ? 180 : 0}deg)`;
        thumb.style.transform = `translateX(${dev ? '100%' : '0%'})`;
      }
    }

    card.addEventListener('click', () => aplicar(!modoDev));
    botoes.forEach(botao => {
      botao.addEventListener('click', () => aplicar(botao.dataset.view === 'dev'));
    });

    // Inclinação 3D seguindo o cursor
    if (motionAtivo && finePointer) {
      retrato.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        tilt = { x: py * -10, y: px * 12 };
        M.animate(card, { rotateY: (modoDev ? 180 : 0) + tilt.y, rotateX: tilt.x }, molaSuave);
      });
      retrato.addEventListener('pointerleave', () => {
        tilt = { x: 0, y: 0 };
        M.animate(card, { rotateY: modoDev ? 180 : 0, rotateX: 0 }, molaSuave);
      });
    }

    aplicar(false);
  }

  // ============================
  // CARGO DIGITADO (hero)
  // ============================
  function iniciarDigitacao() {
    const el = document.getElementById('typed-role');
    if (!el || reduzMovimento) return;
    const cargos = ['Desenvolvedor RPA', 'Desenvolvedor Full Stack', 'Futuro Engenheiro de IA'];
    let r = 0, c = 0, apagando = false;
    function tick() {
      const palavra = cargos[r];
      if (!apagando) {
        el.textContent = palavra.slice(0, ++c);
        if (c === palavra.length) {
          apagando = true;
          return setTimeout(tick, 1700);
        }
      } else {
        el.textContent = palavra.slice(0, --c);
        if (c === 0) {
          apagando = false;
          r = (r + 1) % cargos.length;
        }
      }
      setTimeout(tick, apagando ? 45 : 95);
    }
    tick();
  }

  // ============================
  // DIVIDE TÍTULOS EM PALAVRAS
  // ============================
  function dividirPalavras(titulo) {
    if (titulo.dataset.split) return [];
    titulo.dataset.split = 'true';
    const palavras = [];

    function percorrer(no) {
      Array.from(no.childNodes).forEach(filho => {
        if (filho.nodeType === Node.TEXT_NODE) {
          const partes = filho.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          partes.forEach(parte => {
            if (!parte) return;
            if (/^\s+$/.test(parte)) {
              frag.appendChild(document.createTextNode(' '));
              return;
            }
            const caixa = document.createElement('span');
            caixa.className = 'split-word';
            const interno = document.createElement('span');
            interno.textContent = parte;
            caixa.appendChild(interno);
            frag.appendChild(caixa);
            palavras.push(interno);
          });
          filho.replaceWith(frag);
        } else if (filho.nodeType === Node.ELEMENT_NODE && filho.tagName !== 'BR') {
          percorrer(filho);
        }
      });
    }

    percorrer(titulo);
    return palavras;
  }

  // ============================
  // ENTRADA DO HERO
  // ============================
  function animarHero() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const sequencia = [
      '.hero-greeting', '.hero-name', '.hero-role-line', '.hero-pitch',
      '.hero-highlights .hero-chip', '.hero-section .about-btn > a', '.hero-social .social-icon-link'
    ];
    const itens = sequencia.flatMap(sel => Array.from(hero.querySelectorAll(sel)));
    M.animate(itens, { opacity: [0, 1], y: [28, 0], filter: ['blur(6px)', 'blur(0px)'] }, {
      duration: 0.7,
      delay: M.stagger(0.06, { startDelay: 0.15 }),
      ease: easeSaida
    });

    const retrato = hero.querySelector('.hero-portrait');
    if (retrato) {
      M.animate(retrato, { opacity: [0, 1], scale: [0.88, 1], y: [40, 0] }, { ...molaSuave, delay: 0.25 });
      M.animate(retrato.querySelectorAll('.hero-status-card, .hero-code-card, .portrait-peek'),
        { opacity: [0, 1], scale: [0.6, 1] },
        { type: 'spring', stiffness: 260, damping: 18, delay: M.stagger(0.12, { startDelay: 0.75 }) });

      // Flutuação contínua e suave dos cartões
      retrato.querySelectorAll('.hero-status-card, .hero-code-card').forEach((cartao, i) => {
        M.animate(cartao, { y: [0, i ? 8 : -8, 0] }, {
          duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: 1.4
        });
      });
    }

    // Parallax leve do hero ao rolar
    const texto = hero.querySelector('.about-text');
    if (texto && retrato) {
      M.scroll(M.animate(texto, { y: [0, -60], opacity: [1, 0.25] }, { ease: 'linear' }), {
        target: hero, offset: ['start start', 'end start']
      });
    }
  }

  // ============================
  // REVELAÇÃO AO ROLAR
  // ============================
  function revelarAoRolar() {
    const titulos = document.querySelectorAll(
      'main h2, .heading-project, .heading-experience, .contact-title'
    );
    titulos.forEach(titulo => {
      if (titulo.closest('.hero-section')) return;
      const palavras = dividirPalavras(titulo);
      if (!palavras.length) return;
      M.animate(palavras, { y: '110%' }, { duration: 0 });
      M.inView(titulo, () => {
        M.animate(palavras, { y: ['110%', '0%'] }, {
          duration: 0.8, delay: M.stagger(0.05), ease: easeSaida
        });
      }, { amount: 0.4 });
    });

    const grupos = [
      { sel: '.section-kicker, .work-intro, .section-subtitle, .stats-heading + *', from: { y: 18 } },
      { sel: '.brief-item, .selected-card, .stat-item, .service-card, .contact-card, .testimonial-item, .github-cta, .testimonials-linkedin-cta, .cta-inner > *:not(h2), .final-cta > *:not(h2)', from: { y: 46, scale: 0.97 } },
      { sel: '.project-item', from: { y: 46, rotate: 0, scale: 0.96 }, alternarRotacao: true },
      { sel: '.experience-item', from: { y: 30, scale: 0.97 }, alternarX: true }
    ];

    const vistos = new Set();
    grupos.forEach(grupo => {
      document.querySelectorAll(grupo.sel).forEach((el, i) => {
        if (vistos.has(el) || el.closest('.hero-section')) return;
        vistos.add(el);

        const inicio = { opacity: 0, ...grupo.from };
        if (grupo.alternarX) inicio.x = i % 2 === 0 ? -50 : 50;
        if (grupo.alternarRotacao) inicio.rotate = i % 2 === 0 ? -2.5 : 2.5;

        const fim = { opacity: 1 };
        Object.keys(inicio).forEach(chave => {
          if (chave !== 'opacity') fim[chave] = chave === 'scale' ? 1 : 0;
        });

        M.animate(el, inicio, { duration: 0 });
        M.inView(el, () => {
          const irmaoIndex = Array.from(el.parentElement?.children || []).indexOf(el);
          M.animate(el, fim, {
            ...molaSuave,
            delay: Math.max(0, irmaoIndex % 4) * 0.08
          }).then(() => {
            // Devolve o transform para o CSS (hovers do tema continuam funcionando)
            el.style.transform = '';
          });

          const icone = el.querySelector('.contact-icon img, .experience-logo img, .formation-logo span, .service-icon');
          if (icone) {
            M.animate(icone, { scale: [0, 1], rotate: [-120, 0] }, {
              type: 'spring', stiffness: 220, damping: 14, delay: 0.15 + (irmaoIndex % 4) * 0.08
            }).then(() => { icone.style.transform = ''; });
          }
        }, { amount: 0.15, margin: '0px 0px -40px 0px' });
      });
    });
  }

  // ============================
  // BARRA DE PROGRESSO
  // ============================
  function barraProgresso() {
    const barra = document.createElement('div');
    barra.className = 'scroll-progress';
    barra.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barra);
    M.scroll(M.animate(barra, { scaleX: [0, 1] }, { ease: 'linear' }));
  }

  // ============================
  // BOTÕES COM TOQUE ELÁSTICO
  // ============================
  function toqueElastico() {
    const alvos = '.btn-primary, .btn-secondary, .social-icon-link, .portrait-switch button, .filter-btn, .contact-link, .repo-link';
    M.press(alvos, el => {
      M.animate(el, { scale: 0.94 }, { type: 'spring', stiffness: 600, damping: 28 });
      return () => M.animate(el, { scale: 1 }, { type: 'spring', stiffness: 500, damping: 15 })
        .then(() => { el.style.transform = ''; });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    iniciarRetrato();
    iniciarDigitacao();
    if (!motionAtivo) return;

    document.documentElement.classList.add('motion-on');
    animarHero();
    revelarAoRolar();
    barraProgresso();
    toqueElastico();
  });
})();
