# Desafio Prático — Mini Loja (projeto)

Objetivo: aplicar os conceitos vistos em aula construindo um pequeno gerenciador de catálogo e carrinho de compras em JavaScript. O projeto integra uso de tipos, coerções, arrays, matrizes, funções, Math, buscas e transformações.

Escopo mínimo
 * Um catálogo de produtos representado por um array de objetos: cada produto tem id, nome, preco (number) e estoque (number).
 * Funções para listar produtos, buscar produto por nome/id (find/findIndex), e filtrar por faixa de preço (filter).
 * Um carrinho (array) que permite: adicionar produto (verificando estoque), remover produto, alterar quantidade, e calcular total.
 * Aplicar desconto percentual por cupom (função aplicarDesconto(total, percentual)). Use Math.round/toFixed conforme apropriado para formato de preço.
 * Persistência em memória (objetos/arrays) — não é necessário salvar em disco.
    
    Exemplo de produtos iniciais:
    `const produtos = [
        { id: 1, nome: 'Sabonete', preco: 3.5, estoque: 10 },
        { id: 2, nome: 'Xampu', preco: 12.0, estoque: 5 },
        { id: 3, nome: 'Máscara', preco: 25.0, estoque: 2 }
    ];`

### Requisitos detalhados
1.catalogo:
 * `listar()` → retorna o array de produtos.
 * `buscarPorNome(nome)` → retorna produto (use find).
 * `filtrarPorPreco(min, max)` → retorna array de produtos no intervalo.
 * `atualizarEstoque(id, delta)` → altera estoque somando delta (positivo ou negativo).
        
 2.carrinho:
 * Estrutura do carrinho: array de itens { produtoId, quantidade }.
 * adicionar(carrinho, produtoId, qtd) — adiciona verificando estoque; se já existe, soma quantidade.
 * remover(carrinho, produtoId) — remove o item do carrinho.
 * alterarQuantidade(carrinho, produtoId, novaQtd) — ajusta quantidade, validando estoque; se novaQtd for 0, remove.
 * calcularTotal(carrinho) — soma preços * quantidades (use catalogo para obter preço).

 3.dicas:
 * Monte um catálogo inicial.
 * Crie um carrinho vazio, adicione items, altere quantidades, aplique cupom de desconto e imprima o total final formatado.
 * Demonstre buscas (por nome) e filtragens.

 Extras:
* Implementar ordenação de produtos por preço (uso de sort).
* Implementar histórico de pedidos (matriz: cada pedido é uma linha com itens e total).
* Implementar função sorteioPromo(listaProdutos) que retorna um produto aleatório em promoção (use Math.random).
