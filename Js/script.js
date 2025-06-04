const ctxEntrada = document.getElementById('graficoEntrada').getContext('2d');
const ctxSaida = document.getElementById('graficoSaida').getContext('2d');
const ctxPizza = document.getElementById('graficoPizza').getContext('2d');


let estoque = JSON.parse(localStorage.getItem('estoque')) || [];
let historicoSaidas = JSON.parse(localStorage.getItem('historicoSaidas')) || [];
let saidaProdutos = JSON.parse(localStorage.getItem('saidaProdutos')) || [];

// Função para calcular totais para gráficos de barras
function calcularDadosParaGraficos() {
  const totalEntradas = estoque.reduce((total, item) => total + Number(item.quantidade), 0);
  const totalSaidas = saidaProdutos.reduce((total, item) => total + Number(item.quantidade), 0);

  return {
    labels: ['Entradas', 'Saídas'],
    dados: [totalEntradas, totalSaidas]
  };
}

// Criação dos gráficos iniciais
const graficoEntrada = new Chart(ctxEntrada, {
  type: 'bar',
  data: {
    labels: ['Entradas'],
    datasets: [{
      label: 'Entradas',
      data: [0],
      backgroundColor: '#1abc9c'
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

const graficoSaida = new Chart(ctxSaida, {
  type: 'bar',
  data: {
    labels: ['Saídas'],
    datasets: [{
      label: 'Saídas',
      data: [0],
      backgroundColor: '#e74c3c'
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

const graficoPizza = new Chart(ctxPizza, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      label: 'Quantidade em Estoque',
      data: [],
      backgroundColor: []
    }]
  },
  options: { responsive: true }
});

// Função para atualizar os gráficos de barras
function atualizarGraficos() {
  estoque = JSON.parse(localStorage.getItem('estoque')) || [];
  saidaProdutos = JSON.parse(localStorage.getItem('saidaProdutos')) || [];

  const dados = calcularDadosParaGraficos();

  graficoEntrada.data.datasets[0].data = [dados.dados[0]];
  graficoEntrada.update();

  graficoSaida.data.datasets[0].data = [dados.dados[1]];
  graficoSaida.update();

  atualizarGraficoPizza();
}

// Função para atualizar gráfico de pizza
function atualizarGraficoPizza() {
  const nomes = estoque.map(item => item.nome);
  const quantidades = estoque.map(item => Number(item.quantidade));

  graficoPizza.data.labels = nomes;
  graficoPizza.data.datasets[0].data = quantidades;
  graficoPizza.data.datasets[0].backgroundColor = nomes.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));
  graficoPizza.update();
}

window.addEventListener('storage', () => {
  estoque = JSON.parse(localStorage.getItem('estoque')) || [];
  historicoSaidas = JSON.parse(localStorage.getItem('historicoSaidas')) || [];
  saidaProdutos = JSON.parse(localStorage.getItem('saidaProdutos')) || [];
  atualizarGraficos();
});

// Atualiza gráficos ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  atualizarGraficos();
});

// Função para gerar relatório PDF
function gerarRelatorioPDF() {
  const estoque = JSON.parse(localStorage.getItem('estoque')) || [];
  const doc = new window.jspdf.jsPDF();

  doc.setFontSize(18);
  doc.text("Relatório de Estoque", 14, 20);
  doc.setFontSize(12);

  let y = 30;

  estoque.forEach((produto, index) => {
    doc.text(`Produto ${index + 1}: ${produto.nome}`, 14, y);
    y += 6;
    doc.text(`Lote: ${produto.lote}`, 14, y);
    y += 6;
    doc.text(`Quantidade: ${produto.quantidade}`, 14, y);
    y += 6;
    doc.text(`Valor Unitário: R$ ${produto.valor}`, 14, y);
    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('relatorio_estoque.pdf');
}
