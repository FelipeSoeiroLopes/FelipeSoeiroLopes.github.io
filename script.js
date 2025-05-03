function alternarMenu() {
    const navbar = document.getElementById("navbar");
    navbar.classList.toggle("active");
  }
  
  // Easter Egg - Contador de cliques
  let contadorCliques = 0;
  const limiteCliques = 5; // Número de cliques necessários
  const tempoReset = 2000; // Tempo para resetar o contador (2 segundos)
  let temporizadorClique;
  
  document.getElementById("logoSecreta").addEventListener("click", function () {
    // Cancela o timeout anterior se existir
    clearTimeout(temporizadorClique);
  
    // Incrementa o contador
    contadorCliques++;
  
    // Configura o timeout para resetar o contador
    temporizadorClique = setTimeout(() => {
      contadorCliques = 0;
    }, tempoReset);
  
    // Feedback visual (opcional)
    this.style.transform = "scale(1.1)";
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 200);
  
    // Verifica se atingiu o limite de cliques
    if (contadorCliques >= limiteCliques) {
      window.location.href = "easteregg.html";
      contadorCliques = 0;
      alert("Easter egg ativado! 🎉");
    }
  });
  
  // Fecha o menu ao clicar fora
  window.addEventListener("click", function (event) {
    const navbar = document.getElementById("navbar");
    const menuIcon = document.querySelector(".menu-icon");
    if (!navbar.contains(event.target) && !menuIcon.contains(event.target)) {
      navbar.classList.remove("active");
    }
  });
