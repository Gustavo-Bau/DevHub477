# DEVHUB477

Projeto estático do marketplace DEVHUB, organizado em páginas HTML e estilos CSS.

## Estrutura

- `pages/`: todas as páginas HTML do projeto.
- `css/`: todos os arquivos CSS usados pelas páginas.
- `pages/software-marketplace-dashboard.html`: página principal do marketplace.
- `pages/index.html`: redireciona para a página principal.
- `pages/produto.html`: página genérica de detalhes do produto.

## Página principal

A vitrine principal fica em:

```text
pages/software-marketplace-dashboard.html
```

Ela não possui produtos modelo fixos. A lista é carregada por JavaScript a partir do endpoint:

```text
/api/products
```

Se o endpoint ainda não existir ou não retornar produtos, a página mostra o estado vazio informando que está pronta para receber dados do banco.

## Formato esperado da API

O endpoint pode retornar um array diretamente:

```json
[
  {
    "id": 1,
    "slug": "meu-produto",
    "nome": "Meu Produto",
    "descricao": "Descrição do produto",
    "fornecedor": "Minha Empresa",
    "preco": 99.9,
    "avaliacao": 4.8,
    "categoria": "SaaS e Nuvem",
    "plataforma": "Web",
    "criadoEm": "2026-04-28"
  }
]
```

Ou dentro de uma chave:

```json
{
  "produtos": []
}
```

Também são aceitos nomes em inglês, como `name`, `description`, `vendor`, `price`, `rating`, `category`, `platform` e `createdAt`.

## Filtros

Na página principal, os filtros funcionam sobre os produtos carregados:

- busca por nome, fornecedor e descrição;
- categoria;
- plataforma;
- faixa máxima de preço;
- nota mínima;
- ordenação por mais populares, mais recentes e mais bem avaliados.

Para categoria e plataforma, os valores são normalizados automaticamente. Exemplos aceitos:

- `SaaS e Nuvem` vira `saas-nuvem`;
- `Ferramentas Dev` vira `ferramentas-dev`;
- `Segurança` vira `seguranca`;
- `Análises` vira `analises`;
- `Web`, `Desktop`, `Mobile` e `CLI` funcionam diretamente.

## Detalhes do produto

A página:

```text
pages/produto.html
```

espera receber um identificador na URL:

```text
pages/produto.html?id=meu-produto
```

Ela tenta buscar:

```text
/api/products/:id
```

Quando você conectar ao banco, basta expor esse endpoint para preencher os dados do produto.

## Observações

As páginas foram traduzidas para português do Brasil e os links internos foram ajustados para navegação local entre arquivos `.html`.
