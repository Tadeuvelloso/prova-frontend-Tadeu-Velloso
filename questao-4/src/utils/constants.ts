/**
 * Paginação é feita no cliente: o `GET /products` do backend devolve a lista
 * inteira e ignora qualquer parâmetro de página ou limite — verifiquei
 * chamando o endpoint. Num catálogo grande isso teria que ir para a query
 * string; sobre a lista já carregada, fatiar em memória é adequado.
 */
export const DEFAULT_PAGE_SIZE = 5

export const PAGE_SIZE_OPTIONS = [5, 10, 25] as const
