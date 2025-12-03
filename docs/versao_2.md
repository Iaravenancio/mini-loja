### Extensão do Desafio — Mini Loja (JS)

# Uso de try/catch e Map

Continuaremos evoluindo o projeto da Mini Loja.
Agora você deverá adicionar:

  * Tratamento de erros com try/catch
  * Uso de Map() como estrutura de dados no projeto
Esses novos requisitos devem ser integrados ao código já desenvolvido.

# Novos Requisitos

1) Tratamento de Erros (try…catch)

Adicione tratamento de exceções nas operações que podem falhar. Sempre que houver risco de erro, utilize:

  try {
    // operação arriscada
  } catch (erro) {
    console.error("Mensagem clara");
  }

Pontos onde usar

  * Ao adicionar itens ao carrinho (ex.: quantidade maior que estoque)
  * Ao alterar quantidade (nova quantidade negativa, zero ou acima do estoque)
  * Ao buscar produtos por nome ou id (produto não encontrado)
  * Ao aplicar desconto (percentual inválido)

Você pode criar erros personalizados:
  throw new Error("Produto não encontrado");

2) Uso de Map()
Você deverá utilizar Map() para armazenar ou organizar alguma parte do projeto de maneira mais eficiente. Use Map() em pelo menos uma destas formas:

Opção A — Map para índice rápido de produtos por ID

Isso facilita buscas sem percorrer arrays:

  const mapaProdutos = new Map();
  produtos.forEach(p => mapaProdutos.set(p.id, p));

Uso:

  const produto = mapaProdutos.get(2);

Opção B — Map para cupons de desconto

  const cupons = new Map([
    ["DESCONTO10", 0.10],
    ["BLACKFRIDAY", 0.30]
  ]);

Uso:

  const percentual = cupons.get(codigoDigitado);

Aplique try/catch caso o cupom não exista:

  if (!cupons.has(codigoDigitado)) {
    throw new Error("Cupom inválido");
  }
Opção C — Map para histórico de operações

  const historico = new Map();
  historico.set("ultimaCompra", { total: 89.90, itens: 3 });

Ou:

  historico.set(Date.now(), carrinhoAtual);