# Catálogo de produtos — Questão 3

Aplicação React que consome a [Fake Store API](https://fakestoreapi.com) e exibe o catálogo de produtos em uma tabela com busca, ordenação, filtro por categoria e paginação.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
```

Outros comandos: `npm run build` (typecheck + build de produção), `npm run lint`, `npm run preview`.

Não há variáveis de ambiente: a Fake Store API é pública e não exige autenticação.

### Com Docker

A partir da raiz do repositório:

```bash
docker compose up -d questao-3   # http://localhost:8080
```

Build multi-stage: o Node existe só para gerar o `dist` e fica fora da imagem final, que é um nginx servindo os arquivos estáticos (~26 MB). Não é necessário ter Node instalado.

## Stack

| Ferramenta | Papel |
| --- | --- |
| React 19 + Vite | UI e build |
| TypeScript | tipagem |
| Axios | transporte HTTP e normalização de erro via interceptor |
| TanStack Query | estado assíncrono do servidor: cache, loading, erro, refetch |
| Tailwind CSS v4 | estilo, via plugin do Vite |

A justificativa detalhada das escolhas está no [README da raiz](../README.md), na Questão 3.

## O que a API permite (e o que não permite)

Testei os endpoints antes de desenhar a solução. A Fake Store API **não tem busca** (`?q=` é ignorado), **não ordena por campo** (só `?sort=asc|desc`, por `id`) e **não pagina** (`?offset=` é ignorado). O catálogo inteiro tem 20 produtos.

O único filtro real é o de categoria, com endpoint próprio. Daí a divisão:

- **servidor** — filtro por categoria (`/products/category/:name`)
- **cliente** — busca por texto, ordenação e paginação

Num catálogo real essas três operações precisariam virar query params; sobre 20 itens em memória, resolver no cliente é adequado.

## Estrutura

Arquitetura por responsabilidades, a mesma proposta na Questão 1.

```
src/
├── config/        api.config.ts (baseURL, timeout) · queryClient.ts
├── types/         contratos de Product, ordenação e erro
├── services/      api.ts (instância Axios + interceptor) · productsService.ts
├── hooks/         useProducts · useCategories · useProductsFilters
├── utils/         errorHandler · productFilters · formatters · constants
├── components/
│   ├── common/    SearchInput · Select · Pagination · ErrorState · EmptyState
│   ├── layout/    Header · MainLayout
│   └── modules/ProductsTable/
├── pages/         ProductsPage.tsx
└── styles/        theme.css (tokens do Tailwind)
```

Duas fronteiras que essa divisão preserva:

**`services/` não tem regra de negócio.** Só monta a requisição e devolve o dado. Filtrar e ordenar não acontece ali porque não acontece na API.

**Lógica pura fora do React.** `utils/productFilters.ts` concentra filtro, ordenação e paginação como funções puras; `hooks/useProductsFilters.ts` só cuida do estado e memoriza o resultado. Isso deixa a lógica legível e testável sem envolver ciclo de render.

## Detalhes de implementação

**Erro nunca vaza como `AxiosError`.** O interceptor em `services/api.ts` converte qualquer falha em `AppError`, que estende `Error` (preserva stack trace e funciona com `instanceof`) e carrega `status` e `isNetworkError`. As mensagens são genéricas por faixa de status — detalhar demais o motivo de uma recusa ajuda quem está sondando a API.

**Ordenação copia antes de ordenar.** `Array.prototype.sort` muta o array, e o array vem do cache do React Query: ordenar no lugar corromperia os dados em cache.

**Volta para a página 1 no handler, não em efeito.** Buscar ou reordenar muda quais itens caem em cada página, então o reset acontece no evento que o causou. Há ainda um clamp defensivo (`Math.min(page, totalPages)`) para o caso de a lista encolher por outro caminho e deixar a página atual órfã.

**Sem debounce na busca.** São 20 itens já carregados e nenhuma requisição por tecla; debounce aqui só adicionaria latência.

**Acessibilidade.** Tabela semântica com `<caption>` e `scope`, `aria-sort` na coluna ativa, cabeçalhos ordenáveis são botões (navegáveis por teclado), contador de resultados em `aria-live`, foco visível global e `prefers-reduced-motion` respeitado.

## Como testar os estados

- **Carregando** — DevTools › Network › throttling "Slow 3G" e recarregar: aparece o skeleton com a mesma grade da tabela.
- **Erro** — DevTools › Network › "Offline" e recarregar: mensagem de falha de conexão. Voltando a ficar online, "Tentar novamente" recarrega os dados sem reload da página.
- **Cache** — com a aba Network aberta, selecione uma categoria, volte para "Todas as categorias" e selecione a mesma categoria de novo: não há requisição nova.
- **Busca e ordenação** — busque um termo inexistente para ver o estado vazio; clique em "Preço" duas vezes para inverter a direção.
- **Responsivo** — em ~375px a tabela rola dentro do próprio container e a página não rola na horizontal.