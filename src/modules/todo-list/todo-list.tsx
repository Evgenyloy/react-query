import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { todoListApi } from './api';
import { useState } from 'react';

export function TodoList() {
  const [page, setPage] = useState(1);
  const [enabled, setEnable] = useState(false);
  //isPending - определяет наличие данных в кеше. определяется через status(error, success, pending), если данных нет он будет pending
  //isFetched - срабатывает при загрузке, определяет состояние загрузки через fetchStatus (fetching | paused | idle)
  //isLoading - срабатывает при первой загрузке и пустом кеше (isFetching && isPending)
  const {
    data: todoItems,
    error,
    isPending,
    isFetched,
    isLoading,
    isPlaceholderData,
    status,
    fetchStatus,
  } = useQuery({
    //page - ключ при изменении которого будут обновляться запросы
    queryKey: ['tasks', 'list', { page }],
    queryFn: (meta) => todoListApi.getLogoList({ page }, meta),
    //placeholderData: keepPreviousData - показывает старые данные пока загружаются новый
    //placeholderData - никак не влияет на запрос
    placeholderData: keepPreviousData,
    //initialData наполняет кеш из другого источника (localStorage или результат другого запроса)
    //initialData:
    //enabled - позволяет декларативно включать выключать запросы
    //можно включать в зависимости от загрузки других данных
    enabled: enabled,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="p-5 mx-auto max-w-[1200] mt-10">
      <h1 className="text-3xl font-bold underline mb-5">Todo list</h1>
      <button onClick={() => setEnable((e) => !e)}>Toggle enabled</button>
      <div
        //isPlaceholderData - пока он активен у нас будут меняться стили
        className={
          'flex flex-col gap-4' + (isPlaceholderData ? ' opacity-50' : '')
        }
      >
        {todoItems?.data.map((todo) => (
          <div className="border border-slate-300 rounded p-3" key={todo.id}>
            {todo.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="p-3 rounded border border-teal-500"
        >
          prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, todoItems?.pages ?? 1))}
          className="p-3 rounded border border-teal-500"
        >
          next
        </button>
      </div>
    </div>
  );
}
