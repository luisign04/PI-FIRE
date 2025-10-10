document.addEventListener('DOMContentLoaded', function() {
  const btnLocalizacao = document.getElementById('btn-localizacao');
  const btnPesquisar = document.getElementById('btn-pesquisar');

  if (btnLocalizacao) {
    btnLocalizacao.addEventListener('click', function() {
      alert('Função de localização atual não implementada.');
    });
  }
  if (btnPesquisar) {
    btnPesquisar.addEventListener('click', function() {
      alert('Função de pesquisa de local não implementada.');
    });
  }


const form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  window.location.href = "fire.html";
});
});