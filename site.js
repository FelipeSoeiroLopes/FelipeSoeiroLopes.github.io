// ============================
// FELPS.DEV — INTERAÇÕES E ANIMAÇÕES
// Requer vendor/motion.js carregado antes (expõe window.Motion).
// ============================

(function () {
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const M = window.Motion;
  const motionAtivo = Boolean(M) && !reduzMovimento;

  const mola = { type: 'spring', stiffness: 140, damping: 20, mass: 0.9 };
  const easeSaida = [0.16, 1, 0.3, 1];

  // ============================
  // MENU MOBILE
  // ============================
  function iniciarMenu() {
    const botao = document.querySelector('.menu-btn');
    const painel = document.getElementById('mobile-panel');
    if (!botao || !painel) return;

    function definir(aberto) {
      document.body.classList.toggle('menu-open', aberto);
      botao.setAttribute('aria-expanded', String(aberto));
      botao.querySelector('.menu-text').textContent = aberto ? 'Fechar' : 'Menu';
      painel.inert = !aberto;
      document.documentElement.style.overflow = aberto ? 'hidden' : '';
      if (aberto && motionAtivo) {
        M.animate(painel.querySelectorAll('li, .mobile-foot > *'),
          { opacity: [0, 1], y: [24, 0] },
          { duration: 0.5, delay: M.stagger(0.05, { startDelay: 0.05 }), ease: easeSaida });
      }
    }

    painel.inert = true;
    botao.addEventListener('click', () => definir(!document.body.classList.contains('menu-open')));
    painel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => definir(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
        definir(false);
        botao.focus();
      }
    });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', () => definir(false));
  }

  // Indicador que desliza entre os links do menu desktop
  function indicadorNav() {
    const lista = document.querySelector('.nav-links');
    const indicador = lista?.querySelector('.nav-indicator');
    if (!lista || !indicador) return;
    const ativo = lista.querySelector('[aria-current="page"]');

    function mover(link, instantaneo) {
      if (!link) {
        indicador.style.opacity = '0';
        return;
      }
      const alvo = { x: link.offsetLeft, width: link.offsetWidth, opacity: 1 };
      if (motionAtivo && !instantaneo) {
        M.animate(indicador, alvo, { type: 'spring', stiffness: 420, damping: 34 });
      } else {
        indicador.style.transform = `translateX(${alvo.x}px)`;
        indicador.style.width = `${alvo.width}px`;
        indicador.style.opacity = '1';
      }
    }

    lista.querySelectorAll('a').forEach(link => {
      link.addEventListener('pointerenter', () => mover(link));
      link.addEventListener('focus', () => mover(link));
    });
    lista.addEventListener('pointerleave', () => mover(ativo));
    if (document.fonts?.ready) document.fonts.ready.then(() => mover(ativo, true));
    else mover(ativo, true);
    window.addEventListener('resize', () => mover(ativo, true));
  }

  // ============================
  // HEADER, VOLTAR AO TOPO
  // ============================
  function iniciarRolagem() {
    const header = document.querySelector('.site-header');
    const topo = document.querySelector('.to-top');
    const atualizar = () => {
      header?.classList.toggle('is-scrolled', window.scrollY > 24);
      topo?.classList.toggle('is-visible', window.scrollY > 700);
    };
    atualizar();
    window.addEventListener('scroll', atualizar, { passive: true });
  }

  // ============================
  // EASTER EGG — CLIQUE NO LOGO
  // ============================
  function iniciarEasterEgg() {
    const logo = document.getElementById('logoSecreta');
    if (!logo) return;
    logo.addEventListener('click', () => {
      if (document.querySelector('.easter-portal')) return;
      const portal = document.createElement('div');
      portal.className = 'easter-portal';
      portal.setAttribute('role', 'status');
      portal.setAttribute('aria-live', 'polite');
      portal.innerHTML = `
        <div class="portal-grid" aria-hidden="true"></div>
        <div class="portal-ring portal-ring-one" aria-hidden="true"></div>
        <div class="portal-ring portal-ring-two" aria-hidden="true"></div>
        <div class="portal-content">
          <span class="portal-eyebrow">ACESSO SECRETO AUTORIZADO</span>
          <img src="images/felpsdevsemfundo.png" alt="" aria-hidden="true" />
          <strong>FELPSDEV ARCADE</strong>
          <span class="portal-loading">Inicializando easter egg<span>...</span></span>
          <span class="portal-progress" aria-hidden="true"><i></i></span>
        </div>`;
      document.body.appendChild(portal);
      document.body.classList.add('easter-leaving');
      logo.classList.add('logo-portal-active');
      window.setTimeout(() => window.location.assign('easteregg.html'), reduzMovimento ? 200 : 1350);
    });
  }

  // ============================
  // RETRATO (inclinação sutil)
  // ============================
  function iniciarRetrato() {
    const retrato = document.getElementById('heroPortrait');
    if (!retrato) return;
    const card = retrato.querySelector('.portrait-card');

    if (motionAtivo && finePointer) {
      retrato.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        retrato.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
        retrato.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
        M.animate(card, { rotateY: px * 6, rotateX: py * -5 }, mola);
      });
      retrato.addEventListener('pointerleave', () => {
        M.animate(card, { rotateY: 0, rotateX: 0 }, mola);
      });
    }
  }

  // ============================
  // CARGO DIGITADO
  // ============================
  function iniciarDigitacao() {
    const el = document.getElementById('typed-role');
    if (!el || reduzMovimento) return;
    const cargos = ['Engenharia de IA aplicada', 'Agentes de IA · LLMs · RAG', 'Automação RPA · Full Stack'];
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
      setTimeout(tick, apagando ? 40 : 90);
    }
    el.textContent = '';
    setTimeout(tick, 900);
  }

  // ============================
  // CONTADORES DO BENTO
  // ============================
  function iniciarContadores() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const alvo = Number(el.dataset.count);
      const sufixo = el.dataset.suffix || '';
      if (!motionAtivo) return;
      el.textContent = `0${sufixo}`;
      M.inView(el, () => {
        M.animate(0, alvo, {
          duration: 1.6,
          ease: easeSaida,
          onUpdate: valor => { el.textContent = `${Math.round(valor)}${sufixo}`; }
        });
      }, { amount: 0.6 });
    });
  }

  // ============================
  // FILTRO DE PROJETOS
  // ============================
  function iniciarFiltros() {
    const filtros = document.querySelectorAll('.filter');
    if (!filtros.length) return;
    const projetos = document.querySelectorAll('.projects-grid .project');

    filtros.forEach(filtro => {
      const cat = filtro.dataset.filter;
      const total = cat === 'todos' ? projetos.length
        : Array.from(projetos).filter(p => p.dataset.category.split(' ').includes(cat)).length;
      filtro.insertAdjacentHTML('beforeend', ` <small>${total}</small>`);

      filtro.addEventListener('click', () => {
        filtros.forEach(f => f.setAttribute('aria-pressed', String(f === filtro)));
        const visiveis = [];
        projetos.forEach(p => {
          const mostra = cat === 'todos' || p.dataset.category.split(' ').includes(cat);
          p.hidden = !mostra;
          if (mostra) visiveis.push(p);
        });
        if (motionAtivo) {
          M.animate(visiveis, { opacity: [0, 1], y: [24, 0], scale: [0.97, 1] }, {
            duration: 0.5, delay: M.stagger(0.04), ease: easeSaida
          }).then(() => visiveis.forEach(p => { p.style.transform = ''; }));
        }
        const status = document.getElementById('filter-status');
        if (status) status.textContent = `${visiveis.length} projetos exibidos`;
      });
    });
  }

  // ============================
  // COPIAR E-MAIL
  // ============================
  function iniciarCopiar() {
    document.querySelectorAll('.copy-btn').forEach(botao => {
      const rotulo = botao.querySelector('span');
      const original = rotulo.textContent;
      botao.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(botao.dataset.copy);
          rotulo.textContent = 'Copiado!';
        } catch {
          rotulo.textContent = 'Copie manualmente';
        }
        botao.dataset.copied = 'true';
        setTimeout(() => {
          rotulo.textContent = original;
          botao.dataset.copied = 'false';
        }, 2200);
      });
    });
  }

  // ============================
  // SELETOR DE CURRÍCULO (PT-BR / EN)
  // ============================
  function iniciarMenuCurriculo() {
    const botoes = document.querySelectorAll(".cv-toggle");
    if (!botoes.length) return;

    const iconeDown = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
    const modal = document.createElement("dialog");
    modal.className = "cv-modal";
    modal.setAttribute("aria-labelledby", "cv-modal-titulo");
    modal.innerHTML = `
      <div class="cv-modal-box">
        <div class="cv-modal-head">
          <div>
            <h2 id="cv-modal-titulo">Baixar currículo</h2>
            <p>Escolha o idioma do PDF</p>
          </div>
          <button class="cv-modal-close" type="button" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <div class="cv-options">
          <a href="path/CV_FELIPESLOPES.pdf" download><span class="cv-flag">PT</span><span class="cv-label"><strong>Português</strong><small>PT-BR · PDF</small></span>${iconeDown}</a>
          <a href="path/CV_FELIPESLOPES_EN.pdf" download><span class="cv-flag">EN</span><span class="cv-label"><strong>English</strong><small>Resume · PDF</small></span>${iconeDown}</a>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const caixa = modal.querySelector(".cv-modal-box");
    let origem = null;

    function fechar() {
      if (!modal.open) return;
      modal.close();
    }

    modal.addEventListener("close", () => {
      botoes.forEach(botao => botao.setAttribute("aria-expanded", "false"));
      document.documentElement.classList.remove("cv-modal-aberto");
      if (origem) origem.focus();
    });

    botoes.forEach(botao => {
      botao.addEventListener("click", () => {
        origem = botao;
        botao.setAttribute("aria-expanded", "true");
        document.documentElement.classList.add("cv-modal-aberto");
        modal.showModal();
        if (motionAtivo) {
          const celular = window.matchMedia("(max-width: 640px)").matches;
          M.animate(caixa, celular ? { y: [60, 0], opacity: [0, 1] } : { opacity: [0, 1], y: [16, 0], scale: [0.96, 1] }, { type: "spring", stiffness: 380, damping: 32 });
        }
      });
    });

    modal.querySelector(".cv-modal-close").addEventListener("click", fechar);
    modal.querySelectorAll(".cv-options a").forEach(link => link.addEventListener("click", () => setTimeout(fechar, 150)));
    // Clique fora da caixa (no backdrop) fecha
    modal.addEventListener("click", event => { if (event.target === modal) fechar(); });
    // Evita que o Esc também feche o menu mobile por trás
    modal.addEventListener("keydown", event => { if (event.key === "Escape") event.stopPropagation(); });
  }

  // ============================
  // MARQUEE — PAUSAR
  // ============================
  function iniciarMarquee() {
    const toggle = document.querySelector('.marquee-toggle');
    const marquee = document.querySelector('.marquee');
    if (!toggle || !marquee) return;
    toggle.addEventListener('click', () => {
      const pausado = marquee.classList.toggle('is-paused');
      toggle.setAttribute('aria-pressed', String(pausado));
      toggle.textContent = pausado ? 'Retomar movimento' : 'Pausar movimento';
    });
  }

  // ============================
  // SPOTLIGHT NOS CARDS + BRILHO DO CURSOR
  // ============================
  function iniciarSpotlight() {
    if (!finePointer || reduzMovimento) return;
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let alvoX = 0, alvoY = 0, x = 0, y = 0, rodando = false;
    function loop() {
      x += (alvoX - x) * 0.12;
      y += (alvoY - y) * 0.12;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(alvoX - x) > 0.5 || Math.abs(alvoY - y) > 0.5) requestAnimationFrame(loop);
      else rodando = false;
    }
    window.addEventListener('pointermove', event => {
      alvoX = event.clientX;
      alvoY = event.clientY;
      glow.classList.add('is-active');
      if (!rodando) {
        rodando = true;
        requestAnimationFrame(loop);
      }
    }, { passive: true });
    document.addEventListener('pointerleave', () => glow.classList.remove('is-active'));
  }

  // ============================
  // MOTION — ENTRADAS E REVELAÇÕES
  // ============================
  function dividirPalavras(titulo) {
    const palavras = [];
    function percorrer(no) {
      Array.from(no.childNodes).forEach(filho => {
        if (filho.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          filho.textContent.split(/(\s+)/).forEach(parte => {
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

  function animarEntrada() {
    // Título principal: palavras sobem em sequência
    const titulo = document.querySelector('.hero-title, .h-page');
    if (titulo) {
      const palavras = dividirPalavras(titulo);
      M.animate(palavras, { y: ['110%', '0%'] }, { duration: 0.9, delay: M.stagger(0.06, { startDelay: 0.1 }), ease: easeSaida });
    }

    const itens = document.querySelectorAll('[data-intro]');
    M.animate(itens, { opacity: [0, 1], y: [24, 0], filter: ['blur(6px)', 'blur(0px)'] }, {
      duration: 0.7, delay: M.stagger(0.07, { startDelay: 0.35 }), ease: easeSaida
    });

    const retrato = document.querySelector('.portrait');
    if (retrato) {
      M.animate(retrato, { opacity: [0, 1], scale: [0.88, 1], y: [40, 0] }, { ...mola, delay: 0.25 });
      const flutuantes = retrato.querySelectorAll('.float-card');
      M.animate(flutuantes, { opacity: [0, 1], scale: [0.6, 1] },
        { type: 'spring', stiffness: 260, damping: 18, delay: M.stagger(0.12, { startDelay: 0.8 }) });
      retrato.querySelectorAll('.float-card').forEach((cartao, i) => {
        M.animate(cartao, { y: [0, i ? 8 : -8, 0] }, { duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: 1.6 });
      });
    }

    // Aurora respira devagar
    document.querySelectorAll('.aurora').forEach((a, i) => {
      M.animate(a, { x: [0, i % 2 ? -60 : 60, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }, {
        duration: 16 + i * 5, repeat: Infinity, ease: 'easeInOut'
      });
    });
  }

  function revelarAoRolar() {
    document.querySelectorAll('[data-split]').forEach(titulo => {
      const palavras = dividirPalavras(titulo);
      M.animate(palavras, { y: '110%' }, { duration: 0 });
      M.inView(titulo, () => {
        M.animate(palavras, { y: ['110%', '0%'] }, { duration: 0.85, delay: M.stagger(0.05), ease: easeSaida });
      }, { amount: 0.4 });
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      const tipo = el.dataset.reveal;
      const inicio = { opacity: 0, y: 40, scale: 0.97 };
      if (tipo === 'left') Object.assign(inicio, { x: -40, y: 0 });
      if (tipo === 'fade') Object.assign(inicio, { y: 16, scale: 1 });
      M.animate(el, inicio, { duration: 0 });

      M.inView(el, () => {
        const irmaos = Array.from(el.parentElement?.children || []).filter(n => n.hasAttribute('data-reveal'));
        const ordem = Math.max(0, irmaos.indexOf(el)) % 4;
        M.animate(el, { opacity: 1, x: 0, y: 0, scale: 1 }, { ...mola, delay: ordem * 0.08 })
          .then(() => { el.style.transform = ''; });
        const icone = el.querySelector('.icon-box, .t-logo');
        if (icone) {
          M.animate(icone, { scale: [0, 1], rotate: [-90, 0] }, { type: 'spring', stiffness: 220, damping: 14, delay: 0.15 + ordem * 0.08 })
            .then(() => { icone.style.transform = ''; });
        }
      }, { amount: 0.12, margin: '0px 0px -40px 0px' });
    });

    // Linha da timeline cresce com a rolagem
    const timeline = document.querySelector('.timeline');
    const progresso = timeline?.querySelector('.timeline-progress');
    if (progresso) {
      M.scroll(M.animate(progresso, { scaleY: [0, 1] }, { ease: 'linear' }), {
        target: timeline, offset: ['start 70%', 'end 70%']
      });
    }

    // Barra de progresso da página
    const barra = document.createElement('div');
    barra.className = 'scroll-progress';
    barra.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barra);
    M.scroll(M.animate(barra, { scaleX: [0, 1] }, { ease: 'linear' }));

    // Parallax leve no texto do hero
    const hero = document.querySelector('.hero');
    const heroTexto = hero?.querySelector('.hero-text');
    if (heroTexto) {
      M.scroll(M.animate(heroTexto, { y: [0, -70], opacity: [1, 0.2] }, { ease: 'linear' }), {
        target: hero, offset: ['start start', 'end start']
      });
    }
  }

  // Toque elástico em botões
  function toqueElastico() {
    M.press('.btn, .social, .filter, .portrait-switch button, .menu-btn', el => {
      M.animate(el, { scale: 0.94 }, { type: 'spring', stiffness: 600, damping: 28 });
      return () => M.animate(el, { scale: 1 }, { type: 'spring', stiffness: 500, damping: 15 })
        .then(() => { el.style.transform = ''; });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    iniciarMenu();
    indicadorNav();
    iniciarRolagem();
    iniciarEasterEgg();
    iniciarRetrato();
    iniciarDigitacao();
    iniciarFiltros();
    iniciarCopiar();
    iniciarMenuCurriculo();
    iniciarMarquee();
    iniciarSpotlight();
    iniciarContadores();
    if (!motionAtivo) return;
    animarEntrada();
    revelarAoRolar();
    toqueElastico();
  });
})();
