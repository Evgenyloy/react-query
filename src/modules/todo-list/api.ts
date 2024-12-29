const BASE_URL = 'http://localhost:3000';
type TodoDto = {
  id: string;
  text: string;
  done: boolean;
};

export type PaginatedResult<T> = {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: null | number;
  pages: number;
  prev: null | number;
};

export const todoListApi = {
  //AbortSignal - позволяет отменить запрос если он уже не нужен
  //если мы зайдем на страницу и сразу выйдем AbortSignal прервет запрос
  getLogoList: (
    { page }: { page: number },
    { signal }: { signal: AbortSignal }
  ) => {
    return fetch(`${BASE_URL}/tasks?_page=${page}&_per_page=10`, {
      signal,
    }).then((res) => res.json() as Promise<PaginatedResult<TodoDto>>);
  },
};
