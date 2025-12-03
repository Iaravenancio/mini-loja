// 1) CATÁLOGO (array) — "banco de dados" em memória
const catalogo = [
    { id: 1, nome: "Shampoo", preco: 12.0, estoque: 5 },
    { id: 2, nome: "Sabonete", preco: 3.5, estoque: 10 },
    { id: 3, nome: "Máscara Capilar", preco: 25.0, estoque: 2 },
    { id: 4, nome: "Escova de Cabelo", preco: 30.0, estoque: 3 }
];

// 2) MAPA DE PRODUTOS (Map) — índice rápido por id
// Mapa facilita buscas por id sem percorrer o array com find.
const mapaProdutos = new Map();
catalogo.forEach(p => mapaProdutos.set(p.id, p));

// 3) MAPA DE CUPONS (Map) 
const cupons = new Map([
    ["DESCONTO10", 0.10],
    ["BLACKFRIDAY", 0.30],
    ["BOASVINDAS", 0.05]
]);

// Funções do Catálogo

// Retorna todos os produtos (array)
function listarProdutos() {
    return catalogo;
}

// Busca por nome (case-insensitive)
function buscarPorNome(nome) {
    if (!nome) throw new Error("Nome inválido para busca");
    return catalogo.find(p => p.nome.toLowerCase() === nome.toLowerCase()) || null;
}

// Busca por id usando o Map (acesso O(1))
function buscarPorId(id) {
  // validação simples
    if (typeof id !== "number") throw new Error("ID deve ser número");
    return mapaProdutos.get(id) || null;
}

// Filtra por faixa de preço (min e max)
function filtrarPorPreco(min = 0, max = Number.POSITIVE_INFINITY) {
    return catalogo.filter(p => p.preco >= min && p.preco <= max);
}

// Atualiza estoque somando delta (pode ser positivo ou negativo)
// Usa catalogo para manter array e Map referenciando o mesmo objeto
function atualizarEstoque(id, delta) {
    const produto = buscarPorId(id);
    if (!produto) throw new Error("Produto não encontrado");

    const novoEstoque = produto.estoque + delta;
    if (novoEstoque < 0) throw new Error("Estoque insuficiente");

    produto.estoque = novoEstoque;
    // Como produto é referência a objeto do catalogo, o Map já tem esse objeto atualizado.
    return produto.estoque;
}

// Ordena por preço retornando nova lista (não altera o catalogo original)
function ordenarPorPreco() {
    return [...catalogo].sort((a, b) => a.preco - b.preco);
}

// CARRINHO (array) — estrutura { produtoId, quantidade }
let carrinho = [];

// Função que adiciona ao carrinho com tratamento de exceções (try/catch).
// Observação: a função lança erros em validações; o try/catch apenas registra e relança para o chamador.
function adicionarAoCarrinho(produtoId, qtd) {
    try {
        if (!Number.isInteger(qtd) || qtd <= 0) throw new Error("Quantidade deve ser inteiro > 0");

        // Busca produto por id (via Map)
        const produto = buscarPorId(produtoId);
        if (!produto) throw new Error("Produto não encontrado");

        if (produto.estoque < qtd) throw new Error("Estoque insuficiente para adicionar");

        const item = carrinho.find(i => i.produtoId === produtoId);

        if (item) {
      // Verifica novamente se ao somar não extrapola o estoque
        if (produto.estoque < item.quantidade + qtd) throw new Error("Sem estoque suficiente");
        item.quantidade += qtd;
        } else {
        carrinho.push({ produtoId, quantidade: qtd });
        }

    // Reserva o estoque (subtrai)
    atualizarEstoque(produtoId, -qtd);

    // sucesso → retorna o carrinho atualizado
    return carrinho;
    } catch (erro) {
        console.error("Erro ao adicionar ao carrinho:", erro.message);
        // relança para que o chamador também possa tratar se desejar
        throw erro;
    }
}

// Lista o carrinho mostrando nome do produto, quantidade e preço.
function listarCarrinho() {
    if (carrinho.length === 0) {
        console.log("Carrinho vazio");
        return;
    }

    console.log("\nCarrinho atual:");
    carrinho.forEach(item => {
        const produto = buscarPorId(item.produtoId);
        console.log(`- ${produto.nome} | Quantidade: ${item.quantidade} | Preço: R$ ${produto.preco}`);
    });
}

// Remove item completamente do carrinho
function removerDoCarrinho(produtoId) {
    try {
        const idx = carrinho.findIndex(i => i.produtoId === produtoId);
        if (idx === -1) return; // nada a remover

        // devolve ao estoque
        const qtd = carrinho[idx].quantidade;
        atualizarEstoque(produtoId, qtd);

    // remove do array
    carrinho.splice(idx, 1);
    return true;
    } catch (erro) {
        console.error("Erro ao remover do carrinho:", erro.message);
        throw erro;
    }
}

// Alterar quantidade 
function alterarQuantidade(produtoId, novaQtd) {
    try {
        if (!Number.isInteger(novaQtd) || novaQtd < 0) throw new Error("nova Qtd inválida (deve ser inteiro >= 0)");

        const item = carrinho.find(i => i.produtoId === produtoId);
        if (!item) throw new Error("Item não encontrado no carrinho");

        // se novaQtd === 0, remove do carrinho (a função remover já cuida do estoque)
        if (novaQtd === 0) {
        return removerDoCarrinho(produtoId);
    }

    const diferenca = novaQtd - item.quantidade;
    // Se diferenca > 0 -> precisa diminuir estoque (reservar mais)
    // Se diferenca < 0 -> devolve parte ao estoque
    atualizarEstoque(produtoId, -diferenca);

    item.quantidade = novaQtd;
    return item;
    } catch (erro) {
        console.error("Erro ao alterar quantidade:", erro.message);
        throw erro;
    }
}

// Calcula total do carrinho (sem aplicar cupom)
function calcularTotal() {
    let total = 0;
    for (const item of carrinho) {
        const produto = buscarPorId(item.produtoId);
        if (!produto) throw new Error(`Produto id ${item.produtoId} não encontrado ao calcular total`);
        total += produto.preco * item.quantidade;
    }
    return Number(total.toFixed(2));
}

// Aplica desconto percentual
function aplicarDesconto(total, percentual) {
    if (typeof percentual !== "number" || percentual < 0 || percentual > 100) {
        throw new Error("Percentual inválido");
    }
    const resultado = total - total * (percentual / 100);
    return Number(resultado.toFixed(2));
}

// Função que aplica cupom via Map de cupons — uso do Map para cupons.
// Retorna total com desconto. Lança erro se cupom inválido.
function aplicarCupom(total, codigoCupom) {
    if (!codigoCupom || typeof codigoCupom !== "string") throw new Error("Código de cupom inválido");
    if (!cupons.has(codigoCupom)) throw new Error("Cupom inválido");
    const percentual = cupons.get(codigoCupom) * 100; // transformamos para porcentagem
    return aplicarDesconto(total, percentual);
}

// HISTÓRICO DE PEDIDOS (matriz)
let historicoPedidos = [];

// finalizarPedido — registra pedido como linha da matriz
function finalizarPedido() {
    try {
    if (carrinho.length === 0) return "Carrinho vazio";

    let matrizPedido = [];
    let total = 0;

    for (const item of carrinho) {
        const produto = buscarPorId(item.produtoId);
        if (!produto) throw new Error("Produto não encontrado ao finalizar pedido");

        const subtotal = produto.preco * item.quantidade;
        matrizPedido.push({
            produto: produto.nome,
            quantidade: item.quantidade,
            subtotal: subtotal.toFixed(2)
        });

        total += subtotal;
    }

    // Salva pedido 
    historicoPedidos.push({
    itens: matrizPedido,
    total: Number(total.toFixed(2))
    });

    // Limpa carrinho
    carrinho = [];

    return "Pedido finalizado com sucesso!";
    } catch (erro) {
        console.error("Erro ao finalizar pedido:", erro.message);
        throw erro;
    }
}

// SORTEIO PROMO
function sorteioPromo() {
    if (catalogo.length === 0) return null;
    const indice = Math.floor(Math.random() * catalogo.length);
    return catalogo[indice];
}

//TESTES 

console.log("Início dos testes");

console.log("Catálogo:", listarProdutos());
console.log("Ordenado por preço:", ordenarPorPreco());

// Adicionando itens
adicionarAoCarrinho(1, 2);
adicionarAoCarrinho(2, 1);

listarCarrinho();

// Totais
console.log("Total:", calcularTotal());
console.log("Total com desconto de 10%:", aplicarDesconto(calcularTotal(), 10));

// Finalizar pedido
console.log(finalizarPedido());

// Histórico
console.log("Histórico:");
historicoPedidos.forEach((pedido, index) => {
    console.log(`Pedido ${index + 1}:`);
    console.log("Itens:", pedido.itens);
    console.log(`Total: ${pedido.total}`);
});

// Produto sorteado
console.log("Produto em promoção:", sorteioPromo());

