const estoqueGeral = document.getElementById('estoque-geral');
let estoque = JSON.parse(localStorage.getItem('estoque')) || [];
let historicoSaidas = JSON.parse(localStorage.getItem('historicoSaidas')) || [];

function renderizarEstoque() {
  estoqueGeral.innerHTML = '';

  if (estoque.length === 0) {
    estoqueGeral.innerHTML = '<p>O estoque está vazio.</p>';
    return;
  }

  estoque.forEach((produto, index) => {
    const card = document.createElement('div');
    card.classList.add('produto-card');

    card.innerHTML = `
      ${produto.imagem ? `<img src="${produto.imagem}" alt="${produto.nome}">` : ''}
      <h3>${produto.nome}</h3>
      <p><strong>ID:</strong> ${produto.id}</p>
      <p><strong>Lote:</strong> ${produto.lote}</p>
      <p><strong>Fornecedor:</strong> ${produto.fornecedor}</p>
      <p><strong>CNPJ:</strong> ${produto.cnpj}</p>
      <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
      <p><strong>Valor Unitário:</strong> R$ ${produto.valor}</p>
      <p><strong>Valor Total:</strong> R$ ${(produto.quantidade * parseFloat(produto.valor)).toFixed(2)}</p>
      <button onclick="abrirModal(${index})">Editar</button>
      <button onclick="removerProduto(${index})">Remover</button>
    `;

    estoqueGeral.appendChild(card);
  });
}

function removerProduto(index) {
  const produto = estoque[index];
  const quantidadeDisponivel = produto.quantidade;

  const quantidadeRemoverStr = prompt(
    `Remover quantos itens de ${produto.nome}?\nQuantidade disponível: ${quantidadeDisponivel}`
  );

  if (quantidadeRemoverStr === null) return;

  const quantidadeRemover = parseInt(quantidadeRemoverStr);

  if (isNaN(quantidadeRemover)) {
    alert('Por favor, digite um número válido.');
    return;
  }

  if (quantidadeRemover <= 0) {
    alert('A quantidade deve ser maior que zero.');
    return;
  }

  if (quantidadeRemover > quantidadeDisponivel) {
    alert(`Quantidade indisponível! Só há ${quantidadeDisponivel} itens no estoque.`);
    return;
  }

  const confirmacao = confirm(
    `Confirmar remoção de ${quantidadeRemover} ${quantidadeRemover === 1 ? 'item' : 'itens'} de ${produto.nome}?`
  );

  if (!confirmacao) return;

  // Registra a saída no histórico
  const saida = {
    produtoId: produto.id,
    nome: produto.nome,
    quantidade: quantidadeRemover,
    valorUnitario: produto.valor,
    data: new Date().toISOString()
  };
  historicoSaidas.push(saida);
  localStorage.setItem('historicoSaidas', JSON.stringify(historicoSaidas));

  // Também salva para uso no gráfico da dashboard
  const dadosSaida = JSON.parse(localStorage.getItem("saidaProdutos")) || [];
  dadosSaida.push({ nome: produto.nome, quantidade: quantidadeRemover, data: new Date().toLocaleDateString() });
  localStorage.setItem("saidaProdutos", JSON.stringify(dadosSaida));

  
  if (quantidadeRemover === quantidadeDisponivel) {
    estoque.splice(index, 1);
  } else {
    estoque[index].quantidade -= quantidadeRemover;
  }

  localStorage.setItem('estoque', JSON.stringify(estoque));
  renderizarEstoque();

  
  window.dispatchEvent(new Event('storage'));
}

renderizarEstoque();

window.addEventListener('storage', (event) => {
  estoque = JSON.parse(localStorage.getItem('estoque')) || [];
  historicoSaidas = JSON.parse(localStorage.getItem('historicoSaidas')) || [];
  renderizarEstoque();
});

let indexEditando = null;

function abrirModal(index) {
  indexEditando = index;
  const produto = estoque[index];

  document.getElementById('editar-nome').value = produto.nome;
  document.getElementById('editar-lote').value = produto.lote;
  document.getElementById('editar-quantidade').value = produto.quantidade;
  document.getElementById('editar-valor').value = produto.valor;
  document.getElementById('editar-fornecedor').value = produto.fornecedor;
  document.getElementById('editar-cnpj').value = produto.cnpj;

  const modal = document.getElementById('modal-editar');
  modal.setAttribute("aria-hidden", "false");
  document.getElementById('editar-nome').focus();
}

function fecharModal() {
  document.getElementById('modal-editar').setAttribute("aria-hidden", "true");
}

document.getElementById('modal-editar').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) fecharModal();
});

document.getElementById('form-editar-produto').addEventListener('submit', function(e) {
  e.preventDefault();

  const quantidade = parseInt(document.getElementById('editar-quantidade').value);
  const valor = parseFloat(document.getElementById('editar-valor').value);

  if (isNaN(quantidade) || quantidade < 0) {
    alert('Quantidade inválida.');
    return;
  }
  if (isNaN(valor) || valor < 0) {
    alert('Valor inválido.');
    return;
  }

  const produto = estoque[indexEditando];
  produto.nome = document.getElementById('editar-nome').value;
  produto.lote = document.getElementById('editar-lote').value;
  produto.quantidade = quantidade;
  produto.valor = valor.toFixed(2);
  produto.fornecedor = document.getElementById('editar-fornecedor').value;
  produto.cnpj = document.getElementById('editar-cnpj').value;

  localStorage.setItem('estoque', JSON.stringify(estoque));
  renderizarEstoque();
  fecharModal();

  window.dispatchEvent(new Event('storage'));
});