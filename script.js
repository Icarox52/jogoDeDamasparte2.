function podeMover(deltaLinha, deltaColuna, origem) {
    const peca = origem.querySelector('.peca');
    const cor = peca.classList.contains('preta-peca') ? 'preta' : 'branca';
  
    // Verifica se a peça é uma dama
    const dama = peca.classList.contains('dama');
  
    // Se for uma dama, pode mover para qualquer direção, qualquer número de casas
    if (dama) {
      return Math.abs(deltaLinha) === Math.abs(deltaColuna); // Movimento diagonal
    }
  
    // Se a peça chegou na última linha, ela pode se mover para trás ou para frente
    const ultimaLinha = cor === 'preta' ? 7 : 0;
    if (origem.dataset.linha == ultimaLinha) {
      return Math.abs(deltaLinha) === 1 && Math.abs(deltaColuna) === 1;
    } else {
      // Peças normais só podem se mover para frente
      return cor === 'preta' ? deltaLinha === 1 && Math.abs(deltaColuna) === 1 : deltaLinha === -1 && Math.abs(deltaColuna) === 1;
    }
  }
  
  function moverPeca(casaDestino) {
    const origem = pecaSelecionada.parentElement;
    const [linhaOrigem, colunaOrigem] = [parseInt(origem.dataset.linha), parseInt(origem.dataset.coluna)];
    const [linhaDestino, colunaDestino] = [parseInt(casaDestino.dataset.linha), parseInt(casaDestino.dataset.coluna)];
  
    // Verifica se a casa de destino já tem uma peça
    if (casaDestino.querySelector('.peca')) {
      alert('Este quadrado já está ocupado!');
      return;
    }
  
    const deltaLinha = linhaDestino - linhaOrigem;
    const deltaColuna = colunaDestino - colunaOrigem;
  
    if (podeCapturar(deltaLinha, deltaColuna, origem, casaDestino)) {
      capturarPeca(origem, casaDestino);
    } else if (podeMover(deltaLinha, deltaColuna, origem)) {
      casaDestino.appendChild(pecaSelecionada);
      pecaSelecionada.classList.remove('selecionada');
  
      // Verifica se a peça chegou ao final e se tornou uma dama
      if ((turno === 0 && linhaDestino === 7) || (turno === 1 && linhaDestino === 0)) {
        pecaSelecionada.classList.add('dama'); // Marca a peça como dama
        casaDestino.querySelector('.peca').classList.add('dama');
      }
  
      pecaSelecionada = null;
      alternarTurno();
    }
  }

  

  irParaInicio.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redireciona para a página inicial
  });

  

  resetarPartida.addEventListener('click', () => {
    // Resetar os scores para 0
    score = [0, 0];
  
    // Atualizar os placares no HTML
    document.getElementById('placar-preto').textContent = 0;
    document.getElementById('placar-branco').textContent = 0;
  
    // Resetar o turno para o Jogador 1 (Preto)
    turno = 0;
  
    // Atualizar mensagem de vez
    mensagem.innerHTML = `<strong>Vez de: ${nomes[turno]}</strong>`;
  
    // Atualizar nome do jogador e cor
    nomeJogador.textContent = `${nomes[turno]} - Cor: ${turno === 0 ? 'Preto' : 'Branco'}`;
    nomeJogador.style.color = turno === 0 ? '#000000' : '#ffffff';
  
    // Recriar o tabuleiro (essa função apaga tudo e cria as damas no lugar inicial)
    criarTabuleiro();
  });
  

  function atualizarPontuacao(pecaCapturada) {
    const vencedor = turno === 0 ? 0 : 1;
    score[vencedor] += 100;
    pontuacao.textContent = `Pontuação: ${nomes[0]} - ${score[0]} | ${nomes[1]} - ${score[1]}`;
  
    // Verificar se algum jogador atingiu 1200 pontos
    if (score[0] >= 1200) {
      alert(`${nomes[0]} venceu o jogo com ${score[0]} pontos!`);
      reiniciarJogo();
    } else if (score[1] >= 1200) {
      alert(`${nomes[1]} venceu o jogo com ${score[1]} pontos!`);
      reiniciarJogo();
    }
  }
  
  function reiniciarJogo() {
    // Reiniciar a partida (resetar pontuação e tabuleiro)
    setTimeout(() => {
      score = [0, 0];
      atualizarPontuacao();
      criarTabuleiro();
      turno = 0;
      mensagem.innerHTML = `<strong>Vez de: ${nomes[turno]}</strong>`;
      nomeJogador.textContent = `${nomes[turno]} - Cor: ${turno === 0 ? 'Preto' : 'Branco'}`;
    }, 1500); // Aguardar 1,5 segundos para exibir a mensagem antes de reiniciar
  }

  

  function atualizarRanking() {
    const painel = document.getElementById("painelRanking");
    const mensagem = document.getElementById("mensagemRanking");
    const vitorias = localStorage.getItem("vitorias");
  
    if (!vitorias || parseInt(vitorias) === 0) {
      mensagem.innerText = "Nenhum jogo registrado ainda.";
    } else {
      mensagem.innerText = `Vitórias registradas: ${vitorias}`;
    }
  
    painel.classList.add("painel-aberto");
    painel.classList.remove("painel-fechado");
  }
  
  function fecharRanking() {
    const painel = document.getElementById("painelRanking");
    painel.classList.remove("painel-aberto");
    painel.classList.add("painel-fechado");
  }
  
  // Espera o DOM carregar antes de adicionar eventos
  document.addEventListener("DOMContentLoaded", function () {
    const botao = document.getElementById("abrirRanking");
    if (botao) {
      botao.addEventListener("click", atualizarRanking);
    }
  });

  

  function reiniciarJogo() {
    window.location.href = "damas.html"; // reinicia o arquivo damas.html
  }

  function abrirRanking() {
    const painel = document.getElementById("painelRanking");
    const mensagem = document.getElementById("mensagemRanking");
    const vitorias = parseInt(localStorage.getItem("vitorias") || "0");

    mensagem.textContent = vitorias === 0
      ? "Nenhum jogo registrado ainda."
      : `Vitórias registradas: ${vitorias}`;

    painel.classList.add("ativo");
  }

  function fecharRanking() {
    document.getElementById("painelRanking").classList.remove("ativo");
  }

  // REGISTRAR VITÓRIA AUTOMATICAMENTE (chame isso quando o jogador vencer)
  function registrarVitoria() {
    let vitorias = parseInt(localStorage.getItem("vitorias") || "0");
    vitorias++;
    localStorage.setItem("vitorias", vitorias.toString());
  }

  // EXEMPLO: Chame isso no seu código de damas quando o jogador capturar 12 peças:
  // if (pecasCapturadas >= 12) {
  //     registrarVitoria();
  //     alert("Você venceu!");
  // }


  