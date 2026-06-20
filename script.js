// ============================
// FUNCIONALIDADES PRINCIPAIS
// ============================

function alternarMenu() {
  const navbar = document.getElementById("navbar");
  const menuIcon = document.querySelector(".menu-icon");
  navbar.classList.toggle("active");
  menuIcon.classList.toggle("active");
}

// ============================
// EASTER EGG - CONTADOR DE CLIQUES
// ============================
let contadorCliques = 0;
const limiteCliques = 5;
const tempoReset = 2000;
let temporizadorClique;

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
    window.location.href = "easteregg.html";
    contadorCliques = 0;
    alert("Easter egg ativado! 🎉");
  }
});

// ============================
// FECHA O MENU AO CLICAR FORA
// ============================
window.addEventListener("click", function (event) {
  const navbar = document.getElementById("navbar");
  const menuIcon = document.querySelector(".menu-icon");
  if (!navbar.contains(event.target) && !menuIcon.contains(event.target)) {
    navbar.classList.remove("active");
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

  elementos.forEach(elemento => {
    elemento.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 12px 40px rgba(255, 255, 255, 0.12)';
    });

    elemento.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });
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
  });
  
  // Adiciona active na página correta
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
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
    
    // Remove qualquer transform que possa estar causando problemas
    if (!link.classList.contains('active') && !link.matches(':hover')) {
      link.style.transform = 'none';
    }
  });
}

// ============================
// INICIALIZAÇÃO
// ============================
document.addEventListener('DOMContentLoaded', function() {
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
  