// ============================
// FUNCIONALIDADES PRINCIPAIS
// ============================

document.documentElement.classList.add('js');

function definirMenu(aberto) {
  const navbar = document.getElementById("navbar");
  const menuIcon = document.querySelector(".menu-icon");
  if (!navbar || !menuIcon) return;
  navbar.classList.toggle('active', aberto);
  menuIcon.classList.toggle('active', aberto);
  document.body.classList.toggle('nav-open', aberto);
  navbar.inert = window.matchMedia('(max-width: 1050px)').matches && !aberto;
  menuIcon.setAttribute('aria-expanded', String(aberto));
  menuIcon.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  const label = menuIcon.querySelector('.menu-label');
  if (label) label.textContent = aberto ? 'Fechar' : 'Menu';
}

function alternarMenu() {
  definirMenu(!document.getElementById('navbar')?.classList.contains('active'));
}

// ============================
// EASTER EGG - CONTADOR DE CLIQUES
// ============================
let contadorCliques = 0;
const limiteCliques = 1;
const tempoReset = 2000;
let temporizadorClique;

function ativarTransicaoEasterEgg(logo) {
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
    </div>
  `;

  document.body.appendChild(portal);
  document.body.classList.add('easter-leaving');
  logo.classList.add('logo-portal-active');

  window.setTimeout(() => {
    window.location.assign('easteregg.html');
  }, 1350);
}

document.getElementById("logoSecreta").addEventListener("click", function () {
  clearTimeout(temporizadorClique);
  contadorCliques++;
  
  temporizadorClique = setTimeout(() => {
    contadorCliques = 0;
  }, tempoReset);
  
  // Feedback visual melhorado
  this.style.transform = "scale(1.2) rotate(10deg)";
  this.style.filter = "drop-shadow(0 0 20px rgba(0, 255, 0, 0.8))";
  
  setTimeout(() => {
    this.style.transform = "scale(1) rotate(0deg)";
    this.style.filter = "drop-shadow(0 4px 15px rgba(0, 255, 0, 0.3))";
  }, 300);
  
  if (contadorCliques >= limiteCliques) {
    contadorCliques = 0;
    ativarTransicaoEasterEgg(this);
  }
});

// ============================
// FECHA O MENU AO CLICAR FORA
// ============================
window.addEventListener("click", function (event) {
  const navbar = document.getElementById("navbar");
  const menuIcon = document.querySelector(".menu-icon");
  if (navbar && menuIcon && !navbar.contains(event.target) && !menuIcon.contains(event.target)) {
    definirMenu(false);
  }
});

// ============================
// ANIMAÇÕES DE ENTRADA
// ============================
function observarElementos() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observar elementos para animação
  const elementosParaAnimar = document.querySelectorAll('.stat-item, .testimonial-item, .project-item, .experience-item');
  elementosParaAnimar.forEach(el => {
    observer.observe(el);
  });
}

// ============================
// EFEITO DE PARTÍCULAS INTERATIVAS
// ============================
function criarParticulas() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    particlesContainer.appendChild(particle);
  }
}

// ============================
// EFEITO DE TEXTO TIPO MÁQUINA DE ESCREVER
// ============================
function efeitoTypewriter(elemento, texto, velocidade = 100) {
  let i = 0;
  elemento.innerHTML = '';
  
  function escrever() {
    if (i < texto.length) {
      elemento.innerHTML += texto.charAt(i);
      i++;
      setTimeout(escrever, velocidade);
    }
  }
  
  escrever();
}

// ============================
// EFEITO DE GLOW NO HOVER
// ============================
function adicionarEfeitoGlow() {
  const elementos = document.querySelectorAll('.btn-primary, .btn-secondary, .stat-item, .project-item');
  elementos.forEach(elemento => elemento.classList.add('interactive-surface'));
}

// ============================
// BRILHO QUE SEGUE O CURSOR (SPOTLIGHT)
// ============================
function spotlightCursor() {
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reduzMovimento) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let alvoX = window.innerWidth / 2;
  let alvoY = window.innerHeight / 2;
  let atualX = alvoX;
  let atualY = alvoY;
  let ativo = false;
  let rafId = null;

  function animar() {
    // interpolação suave (lerp) para um movimento fluido
    atualX += (alvoX - atualX) * 0.12;
    atualY += (alvoY - atualY) * 0.12;
    glow.style.setProperty('--mx', atualX + 'px');
    glow.style.setProperty('--my', atualY + 'px');
    rafId = requestAnimationFrame(animar);
  }

  window.addEventListener('mousemove', (e) => {
    alvoX = e.clientX;
    alvoY = e.clientY;
    if (!ativo) {
      ativo = true;
      glow.classList.add('is-active');
      animar();
    }
  });

  window.addEventListener('mouseleave', () => {
    glow.classList.remove('is-active');
  });
  window.addEventListener('mouseenter', () => {
    if (ativo) glow.classList.add('is-active');
  });
}

// ============================
// EFEITO MAGNÉTICO NOS BOTÕES E CARDS DE CONTATO
// ============================
function efeitoMagnetico() {
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reduzMovimento || !finePointer) return;

  const elementos = document.querySelectorAll('.btn-primary, .btn-secondary, .contact-link, .voltar-ao-topo');

  elementos.forEach(el => {
    const forca = 0.25;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * forca}px, ${y * forca}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ============================
// CONTADOR ANIMADO DAS ESTATÍSTICAS
// ============================
function animarContadores() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const contadores = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const contador = entry.target;
        const textoOriginal = contador.textContent.trim();
        const match = textoOriginal.match(/\d+/);
        if (!match) {
          observer.unobserve(contador);
          return;
        }
        const valorFinal = parseInt(match[0]);
        const prefixo = textoOriginal.slice(0, match.index);
        const sufixo = textoOriginal.slice(match.index + match[0].length);
        const duracao = 2000;
        const incremento = valorFinal / (duracao / 16);
        let valorAtual = 0;

        const timer = setInterval(() => {
          valorAtual += incremento;
          if (valorAtual >= valorFinal) {
            contador.textContent = prefixo + valorFinal + sufixo;
            clearInterval(timer);
          } else {
            contador.textContent = prefixo + Math.floor(valorAtual) + sufixo;
          }
        }, 16);

        observer.unobserve(contador);
      }
    });
  });
  
  contadores.forEach(contador => observer.observe(contador));
}

// ============================
// EFEITO DE PARALLAX SUAVE
// ============================
function efeitoParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-section::before, .hero-section::after');
    
    parallaxElements.forEach(elemento => {
      const speed = 0.5;
      elemento.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// ============================
// DESTACAR PÁGINA ATIVA
// ============================
function destacarPaginaAtiva() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar a');
  
  // Remove todas as classes active primeiro
  navLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
  });
  
  // Adiciona active na página correta
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// ============================
// CORRIGIR LAYOUT DOS BOTÕES
// ============================
function corrigirLayoutBotoes() {
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => {
    // Força o redimensionamento correto
    link.style.display = 'inline-block';
    link.style.verticalAlign = 'middle';
  });
}

// ============================
// INICIALIZAÇÃO
// ============================
// Experiência visual premium compartilhada entre todas as páginas.
function inicializarPortfolioPremium() {
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const ambient = document.createElement('div');
  ambient.className = 'premium-ambient';
  ambient.setAttribute('aria-hidden', 'true');
  ambient.innerHTML = '<span class="ambient-orb"></span><span class="ambient-orb"></span><span class="ambient-orb"></span>';
  document.body.prepend(ambient);

  const header = document.querySelector('header');
  const atualizarHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  atualizarHeader();
  window.addEventListener('scroll', atualizarHeader, { passive: true });

  const hero = document.querySelector('.hero-section');
  if (hero && !hero.querySelector('.hero-scroll-cue')) {
    const scrollCue = document.createElement('span');
    scrollCue.className = 'hero-scroll-cue';
    scrollCue.textContent = 'Explore';
    scrollCue.setAttribute('aria-hidden', 'true');
    hero.appendChild(scrollCue);
  }

  const seletores = [
    '.stat-item', '.service-card', '.project-item', '.experience-item',
    '.testimonial-item', '.contact-card', '.github-cta',
    '.testimonials-linkedin-cta', '.final-cta'
  ];
  const elementos = document.querySelectorAll(seletores.join(','));

  elementos.forEach((elemento, index) => {
    elemento.classList.add('premium-reveal');
    elemento.style.setProperty('--reveal-index', String(index % 4));
  });

  if (!reduzMovimento && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -45px 0px' });

    elementos.forEach(elemento => observer.observe(elemento));
  } else {
    elementos.forEach(elemento => elemento.classList.add('is-visible'));
  }

  if (finePointer && !reduzMovimento) {
    const cards = document.querySelectorAll(
      '.stat-item, .service-card, .project-item, .experience-item, .testimonial-item, .contact-card'
    );

    cards.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--pointer-x', `${x}%`);
        card.style.setProperty('--pointer-y', `${y}%`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--pointer-x', '50%');
        card.style.setProperty('--pointer-y', '50%');
      });
    });
  }

  const menuIcon = document.querySelector('.menu-icon');
  if (menuIcon && !menuIcon.hasAttribute('aria-expanded')) {
    menuIcon.setAttribute('aria-expanded', 'false');
  }
  if (menuIcon) {
    menuIcon.setAttribute('aria-controls', 'navbar');
    const label = document.createElement('b');
    label.className = 'menu-label';
    label.textContent = 'Menu';
    menuIcon.prepend(label);
    menuIcon.querySelectorAll('span').forEach(span => span.setAttribute('aria-hidden', 'true'));
    const navbar = document.getElementById('navbar');
    const nav = menuIcon.closest('nav');
    nav.setAttribute('aria-label', 'Navegação principal');
    const brand = document.createElement('a');
    brand.className = 'nav-brand';
    brand.href = 'index.html';
    brand.innerHTML = '<strong>Felipe Lopes<span aria-hidden="true">.</span></strong><small>DESENVOLVEDOR RPA · FULL STACK</small>';
    nav.querySelector('.logo').after(brand);
    const extra = document.createElement('div');
    extra.className = 'nav-extra';
    extra.innerHTML = '<span>Conheça meu trabalho.<br>Vamos criar algo juntos.</span><a href="path/CV_FELIPESLOPES.pdf" download>Baixar currículo <span aria-hidden="true">↓</span></a>';
    navbar.appendChild(extra);
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
    navbar.querySelectorAll('a').forEach(link => link.addEventListener('click', () => definirMenu(false)));
    document.addEventListener('focusin', event => {
      if (!nav.contains(event.target)) definirMenu(false);
    });
    window.matchMedia('(max-width: 1050px)').addEventListener('change', () => definirMenu(false));
    definirMenu(false);
    document.addEventListener('keydown', event => {
      const navbar = document.getElementById('navbar');
      if (event.key === 'Escape' && navbar?.classList.contains('active')) {
        alternarMenu();
        menuIcon.focus();
      }
    });
  }

  const logoSecreto = document.getElementById('logoSecreta');
  if (logoSecreto) {
    logoSecreto.setAttribute('role', 'button');
    logoSecreto.setAttribute('tabindex', '0');
    logoSecreto.setAttribute('aria-label', 'Abrir FelpsDev Arcade');
    logoSecreto.setAttribute('title', 'FelpsDev Arcade');
    logoSecreto.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      logoSecreto.click();
    });
  }

  // Reposiciona âncoras após os componentes dinâmicos entrarem no layout.
  if (window.location.hash) {
    window.setTimeout(() => {
      const destino = document.querySelector(window.location.hash);
      if (destino) destino.scrollIntoView({ block: 'start' });
    }, 120);
  }

  requestAnimationFrame(() => document.body.classList.add('page-ready'));
}

document.addEventListener('DOMContentLoaded', function() {
  inicializarPortfolioPremium();

  const marqueeToggle = document.querySelector('.marquee-toggle');
  const marquee = document.getElementById('tech-marquee');
  if (marqueeToggle && marquee) {
    marqueeToggle.hidden = false;
    marqueeToggle.addEventListener('click', () => {
      const paused = marquee.classList.toggle('is-paused');
      marqueeToggle.setAttribute('aria-pressed', String(paused));
      marqueeToggle.textContent = paused ? 'Retomar movimento ▶' : 'Pausar movimento Ⅱ';
    });
  }

  // Criar partículas
  criarParticulas();
  
  // Observar elementos para animação
  observarElementos();
  
  // Adicionar efeitos de glow
  adicionarEfeitoGlow();

  // Brilho que segue o cursor
  spotlightCursor();

  // Efeito magnético nos botões
  efeitoMagnetico();

  // Animar contadores
  animarContadores();
  
  // Efeito parallax
  efeitoParallax();
  
  // Destacar página ativa
  destacarPaginaAtiva();
  
  // Corrigir layout dos botões
  corrigirLayoutBotoes();
  
  // Buscar repositórios do GitHub
  if (document.getElementById('github-repos')) {
    buscarRepositoriosGitHub();
  }

  // Gerenciar botão de voltar ao topo
  gerenciarBotaoVoltarAoTopo();

  // Tagline do rodapé sempre mudando (máquina de escrever)
  taglineRotativaRodape();

  // Barra de progresso de leitura
  barraProgresso();

  // Efeito de loading
  setTimeout(() => {
    const loading = document.querySelector('.loading');
    if (loading) {
      loading.classList.add('hidden');
    }
  }, 1000);
});

// ============================
// CORRIGIR BOTÕES NO REDIMENSIONAMENTO
// ============================
window.addEventListener('resize', function() {
  setTimeout(() => {
    corrigirLayoutBotoes();
  }, 100);
});

// ============================
// EFEITO DE CURSOR PERSONALIZADO
// ============================
/*
function cursorPersonalizado() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-personalizado';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: linear-gradient(45deg, #00ff00, #00cc00);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    mix-blend-mode: difference;
  `;
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
  });
  
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8)';
  });
  
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
  });
}
*/

// ============================
// BUSCAR REPOSITÓRIOS DO GITHUB
// ============================
async function buscarRepositoriosGitHub() {
  const username = 'FelipeSoeiroLopes';
  const reposContainer = document.getElementById('github-repos');
  if (!reposContainer) return; // Adicionado para evitar erros
  const url = `https://api.github.com/users/${username}/repos?sort=pushed&per_page=6`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Não foi possível buscar os repositórios.');
    }
    const repos = await response.json();

    reposContainer.innerHTML = ''; // Limpa o container

    repos.forEach(repo => {
      const repoCard = `
        <div class="repo-card">
          <h3>${repo.name}</h3>
          <p>${repo.description || 'Sem descrição.'}</p>
          <div class="repo-meta">
            <span>⭐ ${repo.stargazers_count}</span>
            <span>${repo.language || 'N/A'}</span>
          </div>
          <a href="${repo.html_url}" target="_blank" class="repo-link">Ver no GitHub</a>
        </div>
      `;
      reposContainer.innerHTML += repoCard;
    });
  } catch (error) {
    reposContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}

// ============================
// BARRA DE PROGRESSO DE LEITURA
// ============================
function barraProgresso() {
  const barra = document.createElement('div');
  barra.className = 'scroll-progress';
  document.body.appendChild(barra);

  let ticking = false;
  function atualizar() {
    const altura = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = altura > 0 ? (window.scrollY / altura) * 100 : 0;
    barra.style.width = progresso + '%';
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(atualizar);
      ticking = true;
    }
  }, { passive: true });

  atualizar();
}

// ============================
// TAGLINE ROTATIVA DO RODAPÉ (efeito máquina de escrever)
// ============================
function taglineRotativaRodape() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var el = document.querySelector('.footer-tagline');
  if (!el) return;

  var frases = [
    'Desenvolvedor RPA · Full Stack',
    'Automação, dados e IA transformando a forma de trabalhar',
    'Pós-graduando em Inteligência Artificial pela FIAP',
    'Futuro Engenheiro de IA'
  ];

  el.innerHTML = '<span class="tagline-texto"></span><span class="type-caret">_</span>';
  var alvo = el.querySelector('.tagline-texto');
  var f = 0, c = 0, apagando = false;

  function tick() {
    var frase = frases[f];
    if (!apagando) {
      alvo.textContent = frase.slice(0, ++c);
      if (c === frase.length) {
        apagando = true;
        return setTimeout(tick, 2200); // pausa com a frase completa
      }
    } else {
      alvo.textContent = frase.slice(0, --c);
      if (c === 0) {
        apagando = false;
        f = (f + 1) % frases.length;
      }
    }
    setTimeout(tick, apagando ? 28 : 55);
  }

  tick();
}

// ============================
// BOTÃO VOLTAR AO TOPO
// ============================
function gerenciarBotaoVoltarAoTopo() {
  const botao = document.querySelector('.voltar-ao-topo');
  if (!botao) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      botao.classList.add('visivel');
    } else {
      botao.classList.remove('visivel');
    }
  });

  botao.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Inicializar cursor personalizado
// cursorPersonalizado();
