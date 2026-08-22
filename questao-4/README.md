# Gerenciamento de produtos — Questão 4

Aplicação React para cadastrar, listar, editar e excluir produtos, com autenticação por JWT, paginação, filtros por nome e faixa de preço, validação de formulário e feedback visual de sucesso e erro.

Diferente da Questão 3, aqui existe **backend real**: [distribuidora-backend](https://github.com/lucaspfeliciano/distribuidora-backend), hospedado em `https://distribuidora-backend-m46a.onrender.com/api`. A autenticação não é simulada e as operações de escrita persistem.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
```

Outros comandos: `npm run build` (typecheck + build de produção), `npm run lint`, `npm run preview`.

**Acesso de demonstração:** `admin@bebidaspro.com` / `admin123` (as credenciais aparecem na própria tela de login).

Não é necessário criar `.env`: `src/config/env.ts` tem a URL da API como padrão. O `.env.example` existe para apontar a outro backend.

> **O primeiro acesso do dia pode levar até um minuto.** O plano gratuito do Render hiberna o serviço após ~15 minutos sem tráfego. Daí o `timeout` de 60s em `src/config/api.config.ts` e o aviso que a tela de login mostra quando a espera passa de 5 segundos.

## Stack

| Ferramenta | Papel |
| --- | --- |
| React 19 + Vite | UI e build |
| TypeScript | tipagem, em modo estrito |
| React Router | rotas e guardas de acesso |
| Zustand + `persist` | sessão (token e usuário) e tema |
| Axios | transporte HTTP e normalização de erro via interceptor |
| TanStack Query | estado assíncrono do servidor: cache, loading, erro, invalidação |
| React Hook Form + Yup | formulários e validação |
| notistack | fila de feedback (snackbars) |
| Tailwind CSS v4 | estilo, via plugin do Vite |

## O que a API permite (e o que não permite)

Li o código do backend e testei os endpoints antes de desenhar a solução. Quatro achados definiram o projeto:

**`GET /products` não pagina e não filtra por nome nem por preço.** O controller só lê `active`, `category`, `branchId` e `lowStock`; qualquer outro parâmetro é ignorado e a lista inteira volta. Por isso:

- **servidor** — filtro por status (`?active=true|false`)
- **cliente** — busca por nome, faixa de preço e paginação

Num catálogo grande as três teriam que virar query params. Sobre a lista já carregada, resolver em memória é adequado — e o teste confirma que digitar na busca não dispara requisição nenhuma.

**`PUT /products/:id` não aceita `sku` nem `stock`.** O schema de atualização do backend não declara esses campos: o SKU é imutável depois de criado. Isso está expresso no tipo — `UpdateProductInput = Partial<Omit<CreateProductInput, 'sku'>>` — para o compilador impedir o envio, em vez de a regra viver só num comentário. Na tela de edição o campo aparece somente-leitura, com a explicação embaixo.

**`POST /auth/register` é protegido por `authorize([ADMIN])`.** Só um administrador já autenticado cria usuários, então uma tela pública de cadastro receberia 401 antes de chegar ao banco. Daí existir apenas `/login`, e o `authService` não expor essa chamada.

**As rotas de produto têm RBAC.** Criar e editar exigem `admin` ou `gerente`; excluir exige `admin`. A interface espelha isso em `src/utils/permissions.ts`, escondendo as ações que o papel não permite — mas isso é experiência de uso, não segurança: quem autoriza de fato é o backend.

## Estrutura

Arquitetura por responsabilidades, a mesma proposta na Questão 1.

```
src/
├── config/        env · api.config (timeout) · queryClient · queryKeys
├── types/         api (envelope) · auth · product
├── services/      api (Axios + interceptors) · authService · productsService · session
├── store/         authStore (persist) · themeStore (persist)
├── hooks/         useLogin · useProducts · useProduct
│                  useProductMutations · useProductsFilters
├── utils/         errorHandler · productFilters · validators (Yup) · formErrors
│                  permissions · formatters · notify · constants
├── providers/     AppProviders · AuthProvider
├── routes/        index · ProtectedRoute · PublicOnlyRoute · RoleRoute
├── components/
│   ├── common/    Button · Input · Select · Checkbox · Modal · Pagination
│   │              SnackbarToast · ThemeToggle · EmptyState · ErrorState
│   ├── layout/    AppLayout · Header
│   └── modules/   ProductsTable/ · ProductsFilters/ · ProductForm/
├── pages/         LoginPage · ProductsPage · ProductFormPage · NotFoundPage
└── styles/        theme.css (tokens claro/escuro)
```

Três fronteiras que essa divisão preserva:

**`services/` não tem regra de negócio.** Monta a requisição, desembrulha o envelope `{ success, data }` e devolve. Não filtra, não pagina e não trata erro — o interceptor já normalizou a falha.

**Lógica pura fora do React.** `utils/productFilters.ts` concentra busca, faixa de preço, ordenação e paginação como funções puras; `hooks/useProductsFilters.ts` só cuida do estado e memoriza o resultado.

**Componentes não conhecem HTTP.** Nenhuma tela importa Axios ou sabe o formato da resposta: chama um hook e recebe dados, carregando e erro.

## Autenticação

O login devolve `{ user, accessToken }`. O token é gravado pelo middleware `persist` do Zustand — não há `localStorage.setItem` espalhado pelo código — e o interceptor de request o injeta em toda chamada, lendo por `getState()` para não acoplar o Axios ao ciclo do React.

**No boot, o token persistido é validado.** Um token guardado no localStorage é uma promessa, não uma garantia: pode ter expirado, sido revogado, ou o usuário ter sido desativado enquanto a aba estava fechada. O `AuthProvider` chama `GET /auth/me` antes de liberar as telas internas. Quem entra pelo login não paga essa requisição — o `useLogin` semeia o cache com o usuário que a resposta já trouxe.

**O 401 tem dois significados, e o interceptor distingue pela URL.** Em `/auth/login` é credencial errada: a mensagem do backend passa intacta e a sessão existente não é tocada. Em rota protegida é token vencido: a sessão é encerrada, o cache do React Query é limpo — sem isso o próximo usuário veria por um instante os dados do anterior — e o `ProtectedRoute`, que observa o store, leva ao login sozinho. Nenhum `window.location` envolvido.

## Detalhes de implementação

**Erro nunca vaza como `AxiosError`.** O interceptor converte qualquer falha em `AppError`, que estende `Error` (preserva stack trace e funciona com `instanceof`) e carrega `status`, `context` e `details`. Abaixo de 500 a mensagem do backend é repassada — já vem em português e específica ("SKU já cadastrado", "Credenciais inválidas"); de 500 para cima vira mensagem genérica, para não exibir "Internal server error" nem entregar detalhe a quem estiver sondando a API. Há ainda um guard para respostas sem envelope: uma rota inexistente devolve HTML do Express, não JSON.

**A recusa do servidor cai no campo, não num toast.** Um 409 marca o campo SKU; um 400 traz `details` com `path` e `message` por campo, e cada um é levado ao campo correspondente via `setError`. Só o que não pertence a nenhum campo — rede, 403, 5xx — vira aviso geral.

**Mutação não repete automaticamente.** `mutations: { retry: false }`: um POST que falhou por timeout pode ter chegado ao servidor, e repetir criaria o produto duas vezes. Queries podem repetir; escritas, não.

**Invalidação pelo prefixo.** Como o filtro de status entra na `queryKey`, existe um cache por combinação. Depois de criar, editar ou excluir, a invalidação alveja `['products']` — invalidar só a combinação visível deixaria as outras desatualizadas.

**Volta para a página 1 no handler, não em efeito.** Filtrar muda quais itens caem em cada página, então o reset acontece no evento que o causou. Além dele há um clamp `Math.min(page, totalPages)` para o caso da lista encolher **sem** handler nenhum — excluir o único item da última página, por exemplo.

**Ordenação do mais recente primeiro.** Sem isso a lista segue a ordem de inserção do banco e um produto recém-cadastrado nasce fora da tela. A função copia antes de ordenar, porque `sort` muta e o array vem do cache do React Query.

**Sem debounce na busca.** Os itens já estão em memória e nenhuma requisição sai por tecla; debounce só adicionaria latência entre digitar e ver.

**Tema por troca de token CSS.** Os componentes usam só utilitários de token (`bg-surface`, `text-content`) e o tema escuro redefine as variáveis em `:root[data-theme='dark']` — nenhum `dark:` no JSX. Um script inline no `index.html` aplica o tema antes da primeira pintura, para não haver flash branco ao recarregar no escuro.

**Feedback ancorado no topo.** Não é estética: com o snackbar embaixo à direita, ele cobria a linha de ações dos formulários, que também é embaixo à direita. Medido com `elementFromPoint` no centro do botão "Cadastrar produto" — quem respondia era o parágrafo do toast, e o clique não chegava ao botão.

**Acessibilidade.** Tabela semântica com `<caption>`, `scope` e o nome do produto como `th scope="row"`; ações com texto complementar em `sr-only` para não repetir "Editar" sem contexto; contadores em `aria-live`; diálogo de exclusão sobre o `<dialog>` nativo, que entrega prisão de foco e fechamento por `Esc` pelo navegador; link "Pular para o conteúdo" como primeira parada do Tab; alerta de estoque baixo com rótulo além da cor; foco visível global e `prefers-reduced-motion` respeitado.

**Responsivo.** Abaixo de 640px a tabela vira lista de cartões — com ações por linha, rolagem lateral esconderia justamente os botões. A troca é por CSS, não por `window.innerWidth` em estado, que renderizaria uma vez com a suposição errada.

## Como testar cada estado

- **Sessão** — abra `/produtos` deslogado: vai para o login e volta ao destino original depois de entrar. Recarregue logado: a sessão permanece. Adultere o token em DevTools › Application › Local Storage e recarregue: a aplicação cai no login sozinha, com aviso.
- **Carregando** — DevTools › Network › throttling "Slow 3G" e recarregue: aparece o esqueleto com a mesma grade da lista.
- **Erro** — DevTools › Network › "Offline" e recarregue: mensagem de conexão em português. Voltando a ficar online, "Tentar novamente" recarrega sem reload da página.
- **Cadastro** — cadastre um produto e veja-o aparecer no topo da lista. Tente cadastrar de novo com um SKU existente (`COCA-2L`) para ver o 409 caindo no campo, e não num toast.
- **Edição** — repare que o SKU aparece travado, com a explicação embaixo.
- **Exclusão** — o diálogo nomeia o produto e o SKU. `Esc` e "Cancelar" fecham sem excluir.
- **Filtros** — busque `agua` (sem acento) para achar "Água Mineral 500ml". A faixa de preço do seed vai de R$ 1,50 a R$ 8,00; inverta mínimo e máximo para ver o aviso. Troque o status e observe na aba Network: só esse filtro dispara requisição.
- **Paginação** — o seed tem 5 produtos e o padrão é 5 por página, então a segunda página aparece ao cadastrar o sexto.
- **Tema e responsivo** — alterne claro/escuro (persiste no reload) e verifique em 375px: a tabela vira cartões e a página não rola na horizontal.

## Ressalva

O backend é **compartilhado e real**: cadastros e exclusões alteram o banco de verdade. Excluir os 5 produtos do seed deixa a demonstração vazia — vale cadastrar antes de excluir.
