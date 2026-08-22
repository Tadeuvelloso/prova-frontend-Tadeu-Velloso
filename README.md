# Prova Frontend 
### Candidato: Tadeu Velloso Cabral da Silva 

## Questão 1: 

##### Para o projeto front-end proposto foi optado uma arquitetura por responsabilidades,  isolando componentes, paginas, hooks, services, store, types... a escolha da arquitetura parte do pressuposto de um projeto com poucas features, dessa forma a manutenção e evolução do projeto se mostra mais organizada e facilitada para diferentes desenvolvedores vizualizarem o código. Tive um experiência interessante a respeito de diversas arquiteturas, o projeto em que trabalhava começou a crescer muito e suas features ficaram muito grandes, o que ocasionou em race conditions e pastas com muitos files, a solução foi migrar para uma arquitetura modular, reorganizamos as pastas por features (modulos)  e dentro de cada feature separamos internamente por responsabilidades, mantivemos a lógica de separar os componentes dos hooks e querys mas em modulos especificos. Abaixo está a estrutura de pastas por responsabilidades, e a justificativa pela escolha das tecnologias escolhidas.

```
src/
│
├── pages/                          // Responsável: Composição de telas
│   ├── ProductsPage.tsx
│   ├── StockListPage.tsx
│   ├── DashboardPage.tsx
│   └── LoginPage.tsx
│
├── components/                     // Responsável: Componentes UI reutilizáveis
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   └── modules/
│       ├── ProductForm/
│       │   ├── ProductForm.tsx
│       │   └── ProductForm.styles.ts
│       ├── StockTable/
│       │   └── StockTable.tsx
│       └── DashboardCard/
│           └── DashboardCard.tsx
│
├── hooks/                          // Responsável: Lógica de negócio reutilizável
│   ├── useProducts.ts              // Gerencia dados de produtos
│   ├── useStock.ts                 // Gerencia dados de estoque
│   ├── useAuth.ts                  // Autenticação e sessão
│   ├── useProductForm.ts           // Lógica do formulário de produto
│   └── useFilters.ts               // Filtros e buscas
│
├── store/                          // Responsável: Estado global (Zustand)
│   ├── authStore.ts                // Usuário, token, autenticação
│   ├── uiStore.ts                  // Loading, toasts, modais, notificações
│   ├── productStore.ts             // Cache local de produtos
│   └── filterStore.ts              // Estado de filtros da aplicação
│
├── services/                       // Responsável: Requisições HTTP (sem lógica)
│   ├── api.ts                      // Instância axios com interceptadores
│   ├── authService.ts              // Endpoints de autenticação
│   ├── productsService.ts          // Endpoints de produtos
│   ├── stockService.ts             // Endpoints de estoque
│   ├── financialService.ts         // Endpoints financeiros
│   └── customersService.ts         // Endpoints de clientes
│
├── utils/                          // Responsável: Funções utilitárias
│   ├── formatters.ts               // Formatação de moeda, data, números
│   ├── validators.ts               // Validações de formulários
│   ├── errorHandler.ts             // Tratamento padronizado de erros
│   └── constants.ts                // Constantes da aplicação
│
├── types/                          // Responsável: Definições TypeScript
│   ├── product.ts                  // Tipos de produto
│   ├── stock.ts                    // Tipos de estoque
│   ├── user.ts                     // Tipos de usuário
│   ├── api.ts                      // Tipos genéricos de API e responses
│   └── index.ts                    // Exportações centralizadas
│
├── config/                         // Responsável: Configurações globais
│   ├── env.ts                      // Variáveis de ambiente
│   └── api.config.ts               // Configuração da instância HTTP
│
├── styles/                         // Responsável: Estilos globais
│   ├── globals.css                 // Reset e estilos base
│   ├── variables.css               // CSS variables (cores, fontes, spacing)
│   └── theme.css                   // Temas (light/dark)
│
├── assets/                         // Imagens, ícones, fontes
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── App.tsx                         // Raiz da aplicação (routing principal)
├── main.tsx                        // Entry point do React
└── vite-env.d.ts                   // Tipagem do Vite
```

##### As tecnologias escolhidas foram baseadas na complexidade proposta para realização do módulo ERP, para processamento dos dados escolhi uma combinação de tecnologias que priorizam performance, experiência propria como desenvolvedor e manutenibilidade: React com Vite como framework e build tool, Zustand para gerenciamento de estados, Context API para disponibilizar dados persistidos pelo zustand os dados de APIs, evitando assim o uso execivo de props e chamada de uma mesma query em diferentes componentes da mesma arvore. Axios para requisições HTTP, TanStack Query (React Query) para sincronização e cache inteligente de dados. No enunciado foi citado apenas o consumo das apis dos mocroserviçoes, mas acho valido colocar se houvesse a nescessidade de fazer algum criação/edição via esses mesmos serviços, o uso das libs react-hook-forms e zod/yup para validação dos dados junto aos types requeridos pelas apis previamente as requisições put/create/path.

##### A persistência do token é feita através do middleware `persist` do Zustand. Quando o usuário faz login com sucesso, o backend retorna o token, que é salvo no estado do Zustand com `set({ token })`. O middleware `persist` automaticamente sincroniza este estado com localStorage, eliminando a necessidade de gerenciar manualmente `localStorage.setItem()` e `localStorage.getItem()`. Nas proximas requisições , o Axios interceptador lê o token diretamente do Zustand e o injeta no header `Authorization: Bearer ${token}`, garantindo autenticação sem duplicação de código. Se o backend retornar 401 Unauthorized, o interceptador de response automaticamente faz logout, o Zustand persist limpa localStorage, e a aplicação redireciona para `/login`. Este padrão garante uma única fonte de verdade (Zustand) para o estado de autenticação.

![Diagrama do fluxo de autenticação](diagrama_autenticação200.png)

##### Para tratamento de erros globais usaria os interceptadores do Axios, dessa forma toda requisição é verificada e em caso de algum erro aplicamos as regras equivalente, 401 logout como exemplo. Mas tratando todos erros http de forma equivalente com feedbacks relativos a regra de negócio, sempre preservando os dados do usuário, dessa forma mensagens muito específicas facilitariam o uso indevido ou de um usuário mal intecionado. O feedback para o usuário deve ser feito através de toasts com mensagens referentes a ação realizada, para sucesso e falha, o loadings devem ser retornados para o usuário para indicar o andamente de uma requeição assincrona que impede alguma vizualização ou ação, podendo ser mais específica ou global. O uso do react query e do zustand são fundamentais para manter a coererencia específica de cada ação. Esses recursos podem ser preventivos para excesso de requisições e prevenção de race conditions. Um provider encapsulando toda camada de componentes autorizados pelo usuario seriam protegidas por um provider que só pode renderizar seus componetes se houver o token correspondente, nessa mesma arvore que ficaria os toasts e feedbacks.

## Questão 2: 

##### Na Questão 1 optei por uma arquitetura por responsabilidades porque o escopo proposto era pequeno. Para um projeto de médio/grande porte eu inverteria essa chave e iria de arquitetura modular, por features. A razão é a que vivi na prática e comentei na primeira questão: enquanto o projeto é pequeno, agrupar por responsabilidade funciona bem, mas quando as features crescem as pastas `components/`, `hooks/` e `services/` viram depósitos com dezenas de arquivos de contextos que não conversam entre si, e uma alteração simples obriga o desenvolvedor a passear por cinco pastas diferentes para entender um fluxo só. Na arquitetura modular cada feature é uma pasta fechada que carrega dentro dela os seus componentes, hooks, services, store e tipos, e a separação por responsabilidades continua existindo, só que dentro do módulo. O ganho é de manutenção e de evolução: uma feature nova é uma pasta nova, não uma dispersão de arquivos em pastas já lotadas, e times diferentes conseguem trabalhar em módulos diferentes sem colidir no mesmo diretório.

```
src/
│
├── modules/                        // Responsável: features de negócio
│   ├── products/
│   │   ├── components/             // Componentes exclusivos do módulo
│   │   │   ├── ProductForm/
│   │   │   └── ProductsTable/
│   │   ├── hooks/                  // useProducts, useProductForm
│   │   ├── services/               // Endpoints do domínio de produtos
│   │   ├── store/                  // Estado local do módulo
│   │   ├── types/                  // Tipos do domínio
│   │   ├── utils/                  // Regras puras (filtros, cálculos)
│   │   └── index.ts                // API pública do módulo
│   ├── stock/
│   ├── financial/
│   ├── customers/
│   └── auth/
│
├── shared/                         // Responsável: o que é usado por 2+ módulos
│   ├── components/
│   │   ├── ui/                     // Wrappers do design system (MUI)
│   │   └── layout/                 // Header, Sidebar, MainLayout
│   ├── hooks/                      // useDebounce, usePagination, useModal
│   ├── services/
│   │   └── api.ts                  // Instância axios com interceptadores
│   ├── utils/                      // Formatters, validators, errorHandler
│   └── types/                      // Tipos genéricos de API e responses
│
├── theme/                          // Responsável: design system
│   ├── theme.ts                    // Tema MUI (cores, tipografia, spacing)
│   └── overrides.ts                // Customização por componente
│
├── routes/                         // Responsável: rotas e proteção de acesso
│   ├── index.tsx
│   └── ProtectedRoute.tsx
│
├── config/                         // Variáveis de ambiente e configs globais
├── App.tsx
└── main.tsx
```

##### Componentização. A regra que sigo é separar o componente que sabe de negócio do componente que só sabe desenhar. Os componentes de `shared/components/ui` não conhecem produto, estoque nem financeiro, recebem props e devolvem interface, e por isso podem ser usados em qualquer módulo. Já um `ProductForm` vive dentro do módulo de produtos porque só faz sentido ali, e mesmo ele delega a lógica para um hook. Para um projeto desse porte eu optaria por uma biblioteca de componentes, e a minha escolha seria o MUI. O motivo não é economizar tempo escrevendo botão, é padronização: com o MUI o design fica centralizado no tema, então espaçamento, cor, tipografia e variantes de componente são definidos uma vez em `theme/` e valem para o projeto inteiro. Quando o projeto cresce e entram desenvolvedores novos, um componente criado por qualquer um já nasce dentro do padrão visual em vez de virar mais uma variação de botão com um cinza ligeiramente diferente. O cuidado que tomo é não espalhar o MUI cru por todo lado: componentes muito usados ganham um wrapper em `shared/components/ui`, o que dá um ponto único para ajustar comportamento padrão e evita que uma futura troca de biblioteca vire uma varredura em centenas de arquivos.

##### Hooks customizados. Os hooks são onde a lógica de fato mora. Um componente que precisa listar produtos não deveria conhecer React Query, Axios ou o formato da resposta da API, ele chama `useProducts()` e recebe dados, carregando e erro. Isso mantém o componente legível e concentra a mudança num lugar só quando o backend muda um campo. Separo os hooks em dois níveis: os genéricos ficam em `shared/hooks` porque não têm domínio nenhum, como `useDebounce`, `usePagination` ou `useModal`, e os de negócio ficam dentro do módulo, como `useProductForm`. Numa tela de listagem esse desenho fica claro quando a responsabilidade é quebrada em dois: um hook cuida da requisição e do cache dos dados, e outro cuida de busca, ordenação e paginação sobre o que já foi carregado. A tabela recebe a lista pronta e não sabe de onde ela veio nem como foi filtrada, então o dia em que a ordenação passar a ser feita pelo backend muda só o hook e a interface continua igual.

##### Reutilização de código. O ponto que mais evita retrabalho é o `index.ts` de cada módulo funcionando como API pública. O que está exportado ali pode ser consumido por outro módulo, o resto é interno, e isso impede aquele acoplamento silencioso em que um módulo importa um arquivo de dentro de outro e passa a quebrar sempre que o vizinho muda um detalhe. Sobre promover código para `shared`, evito antecipar: só sobe quando o mesmo comportamento aparece em pelo menos dois módulos de verdade. Abstrair cedo demais costuma gerar um componente cheio de flags para atender casos que ainda nem existem, e isso é mais caro de manter do que uma duplicação pontual. Além disso mantenho os utilitários de formatação e validação em `shared/utils`, porque moeda, data e mensagens de erro precisam ser iguais em todas as telas, e é o tipo de coisa que diverge rápido se cada módulo escrever a sua.

##### Separação entre regras de negócio e interface. Trabalho com três camadas bem definidas. Os services só fazem requisição, não têm lógica nem decidem nada. As regras puras, cálculos, filtros e validações ficam em funções fora do React, o que as torna previsíveis e testáveis sem precisar montar componente. Os hooks orquestram, ligando service, estado e regra. E o componente fica com a interface, ou seja, o que renderizar e como reagir ao clique. Um sinal claro de que algo saiu do lugar é encontrar `if` de regra de negócio dentro do JSX ou um `.filter()` com cálculo direto no componente, é o momento de mover aquilo para uma função pura ou para o hook. O ganho prático é que a regra passa a poder ser testada, reaproveitada em outra tela e alterada sem risco de quebrar layout.

##### Estratégias para testes. Eu penso os testes por camada, seguindo a divisão acima. As funções puras de regra de negócio são as primeiras a testar, com Vitest, porque são baratas, rápidas e é onde um erro causa prejuízo real, um cálculo de total ou uma validação errada. Os hooks testo com `renderHook`, verificando o comportamento diante de sucesso e de falha da requisição. Nos componentes uso Testing Library e testo comportamento em vez de implementação, ou seja, o usuário digita na busca e a linha esperada aparece, e não se o estado interno mudou, porque teste amarrado à implementação quebra em toda refatoração e acaba sendo deletado pelo time. Para as telas que dependem de API uso o MSW e simulo a resposta no nível da rede, o que permite testar também o caminho do erro e do carregando, que na prática é onde mais aparece bug. E reservo testes de ponta a ponta, com Playwright ou Cypress, para poucos fluxos críticos, como login e o cadastro principal do sistema, porque são testes caros de manter e não compensa cobrir tudo com eles. Não persigo porcentagem de cobertura, prefiro cobrir bem o que é regra de negócio e o que já quebrou uma vez.

##### Boas práticas que costumo seguir. TypeScript com configuração estrita, evitando `any`, porque num projeto grande o tipo é o que documenta o contrato com a API e avisa em tempo de build o que só apareceria em produção. ESLint e Prettier rodando no commit com Husky e lint-staged, para que discussão de formatação não ocupe espaço no code review. Alias de importação em vez de caminhos relativos longos, o que também facilita mover arquivo de lugar. Commits pequenos e descritivos, no padrão de conventional commits, e pull requests curtas, porque PR grande não é revisada de verdade. Variáveis de ambiente centralizadas em `config`, nunca URL fixa espalhada no código. Tratamento de erro e feedback centralizados como descrevi na Questão 1, com interceptador no Axios e toasts padronizados, para que o usuário sempre receba resposta da ação. Carregamento por rota com lazy loading, que num projeto modular sai quase de graça, já que cada módulo é uma fronteira natural de divisão do bundle. E atenção à acessibilidade desde o começo, usando os componentes semânticos do MUI, rótulo em campo de formulário e navegação por teclado, porque adaptar depois costuma custar mais do que fazer certo desde o início.


## Questão 3: 

##### O projeto está em `questao-3/`. Para rodar: `cd questao-3 && npm install && npm run dev`. A aplicação consome a Fake Store API (`https://fakestoreapi.com`) e exibe o catálogo de produtos em uma tabela com busca por texto, ordenação por título, preço e avaliação, filtro por categoria e paginação.

##### Escolha da API. Optei pela Fake Store API por ser uma das citadas no enunciado e por ter campos que rendem uma tabela de verdade: título, categoria, preço e avaliação com nota e número de votos. Antes de decidir a arquitetura, testei os endpoints um a um, e o que encontrei mudou o desenho da solução: a API **não suporta busca** (`?q=` é ignorado e devolve os 20 produtos), **não ordena por campo** (só existe `?sort=asc|desc`, que ordena por `id`, e `?sortBy=price` é ignorado) e **não pagina** (`?offset=` é ignorado; só há `?limit=` truncando do início). O que ela oferece de verdade é o filtro por categoria, com endpoint dedicado em `/products/category/:name` e a lista em `/products/categories`. Por isso a divisão do projeto é essa: **categoria vai ao servidor, busca e ordenação acontecem no cliente**. Não é preferência, é o que a API permite — e deixo explícito porque um filtro client-side sobre 20 itens é adequado, mas não escalaria para um catálogo real, onde busca e ordenação teriam que virar query params.

##### Axios em vez de fetch. A diferença que pesou foi o interceptor. Toda falha da aplicação passa por um único ponto (`src/services/api.ts`), que converte o erro em um `AppError` tipado com mensagem já em português — nenhum componente ou hook precisa importar Axios para tratar erro, e trocar a biblioteca HTTP amanhã ficaria restrito a esse arquivo. Além disso o Axios traz `baseURL` e `timeout` nativos, e trata 4xx/5xx como rejeição, enquanto o `fetch` resolve normalmente e obriga a checar `res.ok` em toda chamada — um esquecimento e o erro passa como sucesso. O `fetch` daria conta do recado num projeto desse tamanho; a escolha foi pela camada de erro centralizada, não pelo volume de requisições.

##### TanStack Query em vez de `useEffect` + `useState`. Buscar dados com `useEffect` exige escrever à mão os estados de carregando, erro e sucesso, o cancelamento em caso de desmontagem e a proteção contra resposta fora de ordem. O React Query entrega isso pronto e, principalmente, resolve dois problemas concretos aqui. O primeiro é o cache por `queryKey`: a categoria entra na chave (`['products', categoria]`), então trocar de categoria e voltar não dispara requisição nova — os dados vêm do cache, o que é a prevenção de excesso de requisições que descrevi na Questão 1. O segundo é a race condition: trocar o filtro rápido, com `useEffect`, pode fazer a resposta antiga chegar depois da nova e sobrescrever a tela; com a chave por categoria, cada resposta é guardada no seu próprio lugar e o problema deixa de existir. Usei ainda `keepPreviousData`, que mantém a tabela anterior visível enquanto a nova categoria carrega em vez de piscar para o estado de carregamento, e um retry seletivo que só repete falha de rede e 5xx — repetir um 4xx só devolveria o mesmo erro.

##### Por que as duas juntas. Não são concorrentes: o Axios é o transporte (como a requisição sai e como o erro volta normalizado) e o React Query é o gerenciamento do estado assíncrono do servidor (quando buscar, o que cachear, o que mostrar enquanto carrega). O React Query não faz requisição, ele orquestra a função que faz — e essa função é o service em Axios.

##### Onde cada requisito do enunciado está. Busca assíncrona: `src/hooks/useProducts.ts` e `src/services/productsService.ts`. Indicador de carregamento: `ProductsTableSkeleton`, que reproduz a grade da tabela para não haver salto de layout quando os dados chegam. Tratamento de erro: `src/utils/errorHandler.ts` traduz o erro por faixa de status, com mensagens propositalmente genéricas para não entregar detalhe a quem estiver sondando a API, e o `ErrorState` oferece "Tentar novamente" que chama o `refetch()` sem recarregar a página. Exibição em tabela: `src/components/modules/ProductsTable/`. Pesquisa e ordenação: `src/utils/productFilters.ts` (funções puras, fora do React, para poderem ser lidas e testadas isoladamente) consumidas por `src/hooks/useProductsFilters.ts`.

## Questão 4:

##### O projeto está em `questao-4/`. Para rodar: `cd questao-4 && npm install && npm run dev`. Acesso de demonstração: `admin@bebidaspro.com` / `admin123`. A aplicação faz o gerenciamento completo de produtos — listagem, cadastro, edição, exclusão, paginação, filtros por nome e faixa de preço, validação de formulário e feedback de sucesso e erro — sobre um backend real, o [distribuidora-backend](https://github.com/lucaspfeliciano/distribuidora-backend) hospedado no Render. A tela de login existe e a autenticação é JWT de verdade, não simulada.

##### O que a API permite, e o que isso forçou. Como na Questão 3, testei os endpoints antes de desenhar a solução, e de novo o que encontrei mudou o projeto. O `GET /products` **não pagina e não filtra por nome nem por faixa de preço**: o controller só lê `active`, `category`, `branchId` e `lowStock`, e qualquer outro parâmetro é ignorado. Então a divisão ficou: **status vai ao servidor, busca por nome, faixa de preço e paginação acontecem no cliente**. Não é preferência, é o que a API oferece — e um filtro em memória é adequado sobre a lista já carregada, mas não escalaria para um catálogo grande. Encontrei mais três limites que viraram decisão de interface: o `PUT /products/:id` **não aceita `sku` nem `stock`**, ou seja, o SKU é imutável depois de criado — expressei isso no tipo, com `UpdateProductInput = Partial<Omit<CreateProductInput, 'sku'>>`, para o compilador impedir o envio em vez de deixar a regra num comentário, e na edição o campo aparece travado com a explicação; o `POST /auth/register` é protegido por `authorize([ADMIN])`, então tela pública de cadastro receberia 401 antes de chegar ao banco, e por isso existe apenas o login; e as rotas de produto têm RBAC — criar e editar exigem `admin` ou `gerente`, excluir exige `admin` —, o que a interface espelha escondendo as ações que o papel não permite, deixando claro que isso é experiência de uso e não segurança, já que quem autoriza de fato é o backend.

##### Autenticação e o provider que protege a árvore. É aqui que a Questão 1 sai do papel. O token vem do login e é gravado pelo middleware `persist` do Zustand, sem nenhum `localStorage.setItem` espalhado pelo código, e o interceptor de request do Axios o injeta em toda chamada lendo por `getState()` — não por hook, porque o Axios não vive dentro da árvore do React e porque `getState()` devolve o valor no instante do envio, evitando mandar um token velho capturado num closure. No boot, o `AuthProvider` valida o token persistido com `GET /auth/me` antes de liberar as telas internas: token guardado no navegador é uma promessa, não uma garantia, pode ter expirado ou sido revogado enquanto a aba estava fechada. Quem entra pelo login não paga essa requisição, porque o `useLogin` semeia o cache com o usuário que a própria resposta trouxe. E o 401 tem dois significados que o interceptor distingue pela URL: em `/auth/login` é credencial errada, a mensagem do backend passa intacta e a sessão existente não é tocada; em rota protegida é token vencido, a sessão é encerrada e o cache do React Query é limpo junto — sem isso o próximo usuário veria por um instante os dados do anterior, servidos do cache antes do primeiro refetch. O redirecionamento não é imperativo: o `ProtectedRoute` observa o token no store e reage à ausência dele, então o mesmo mecanismo cobre entrar e ser desconectado, sem nenhum `window.location` recarregando a aplicação.

##### Validação e o erro que cai no campo certo. O Yup espelha o schema Zod do backend, e os campos numéricos usam `valueAsNumber`, o que faz um campo vazio virar `NaN` — daí o `typeError` em cada preço, senão a mensagem exibida seria a do Yup em inglês falando de tipo, quando o que houve foi simplesmente não preencher. O ponto que considero mais relevante é o tratamento da recusa do servidor: um 409 marca o campo SKU com a mensagem que o backend já manda em português, e um 400 traz `details` com `path` e `message` por campo, cada um levado ao campo correspondente via `setError`. Só o que não pertence a nenhum campo — falha de rede, 403, 5xx — vira aviso geral. Isso exigiu inverter uma responsabilidade que eu tinha colocado no lugar errado: quem captura a falha da submissão é o formulário, que é quem tem o `setError` e sabe quais campos existem, e não a página; um `try/catch` na página engolia o erro antes de ele chegar lá e transformava tudo em toast genérico.

##### Feedback visual e um detalhe que só apareceu testando. Para os toasts usei o notistack, que resolve fila, empilhamento, tempo em tela, portal e transições — o visual continua sendo o do projeto, registrado no `Components` do provider, porque o padrão dele é Material Design e destoaria dos tokens. O `enqueueSnackbar` da versão 3 é função autônoma e não hook, o que importa porque o interceptor do Axios e os callbacks de mutação rodam fora de componente. O detalhe que só apareceu na verificação: com o snackbar ancorado embaixo à direita, ele cobria a linha de ações dos formulários, que também é embaixo à direita. Medi com `elementFromPoint` no centro do botão "Cadastrar produto" e quem respondia era o parágrafo do toast — na prática, quem cadastrasse um produto encontraria o botão morto pelos segundos seguintes. Mudei a âncora para o topo: feedback não pode disputar espaço com controle de ação.

##### Onde cada requisito do enunciado está. Listagem: `src/pages/ProductsPage.tsx` com `src/hooks/useProducts.ts`. Cadastro e edição: `src/pages/ProductFormPage.tsx` e `src/components/modules/ProductForm/`, em rotas próprias (`/produtos/novo` e `/produtos/:id/editar`) para funcionarem por link direto e serem protegidas por papel. Exclusão: `DeleteProductDialog`, sobre o elemento `<dialog>` nativo, que entrega prisão de foco e fechamento por `Esc` pelo navegador em vez de uma armadilha de foco escrita à mão. Paginação e filtros: `src/utils/productFilters.ts`, funções puras fora do React, consumidas por `src/hooks/useProductsFilters.ts`. Validação: `src/utils/validators.ts` e `src/utils/formErrors.ts`. Feedback: `src/utils/notify.ts` e `src/components/common/SnackbarToast.tsx`. Estrutura preparada para autenticação: `src/providers/AuthProvider.tsx`, `src/routes/` e `src/services/api.ts`. Responsividade e tema claro/escuro: abaixo de 640px a tabela vira lista de cartões, porque com ações por linha a rolagem lateral esconderia justamente os botões, e o tema troca por redefinição de tokens CSS, sem nenhum `dark:` no JSX.

### Auxilio de AI:

- Na questão três criei um plano com o claude para execução de um projeto que vai consumir uma api publica, comuniquei no plano a escolha da api "fakestoreapi", fiz essa escolha pois achei mais facil para vizualização das reordenações e por fazer mais sentido com a sentença da questão, pedi para criar um errorHandler para tratamento de erros para tradução para o português. 

- Na questão quatro o plano foi construído junto com o Claude a partir de um backend real que eu já tinha, o `distribuidora-backend`. Antes de planejar, pedi que ele lesse o código do backend e testasse os endpoints, e foi isso que revelou os limites que moldaram a solução: a ausência de paginação e de filtro por nome e preço, o `sku` fora do schema de atualização e o `register` restrito a admin. A execução foi feita em etapas pequenas, uma por commit, com verificação em navegador headless ao fim de cada uma — foi assim que apareceram três defeitos que eu não teria notado só lendo o código: o `try/catch` que engolia o erro antes de o formulário poder marcar o campo, o toast cobrindo o botão de salvar, e o produto recém-cadastrado nascendo fora da primeira página.
