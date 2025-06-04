const form = document.getElementById('form-produto');
const totalSpan = document.getElementById('total');
const mensagemSucesso = document.getElementById('mensagem-sucesso');

let estoque = JSON.parse(localStorage.getItem('estoque')) || [];

// Função para gerar ID único
function gerarID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Atualiza o valor total automaticamente
form.valor.addEventListener('input', atualizarValorTotal);
form.quantidade.addEventListener('input', atualizarValorTotal);

function atualizarValorTotal() {
    const quantidade = parseFloat(form.quantidade.value) || 0;
    const valor = parseFloat(form.valor.value) || 0;
    const total = (quantidade * valor).toFixed(2);
    totalSpan.textContent = total;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = form.foto.files[0];

    reader.onload = function() {
        const produto = {
            id: gerarID(),
            nome: form.nome.value,
            lote: form.lote.value,
            quantidade: parseInt(form.quantidade.value),
            valor: parseFloat(form.valor.value).toFixed(2),
            fornecedor: form.fornecedor.value,
            cnpj: form.cnpj.value,
            imagem: file ? reader.result : null,
            dataEntrada: new Date().toISOString()
        };

        estoque.push(produto);
        salvarEstoque();

        // Registro para dashboard ou histórico de entradas
        let produtosEntrada = JSON.parse(localStorage.getItem("produtosEntrada")) || [];
        produtosEntrada.push({
            nome: produto.nome,
            quantidade: produto.quantidade,
            data: new Date().toLocaleDateString()
        });
        localStorage.setItem("produtosEntrada", JSON.stringify(produtosEntrada));

        form.reset();
        totalSpan.textContent = "0.00";

        mensagemSucesso.style.display = 'block';
        setTimeout(() => {
            mensagemSucesso.style.display = 'none';
        }, 3000);

        
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onload();
    }
});

function salvarEstoque() {
    localStorage.setItem('estoque', JSON.stringify(estoque));
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'estoque',
        newValue: JSON.stringify(estoque)
    }));
}