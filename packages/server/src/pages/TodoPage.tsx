import { DefaultLayout } from '../layouts/DefaultLayout';
import { fetchJson } from '../utils/fetchUtils';

type TodoItem = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type TodoPageProps = {
  id: string;
};

export async function TodoPage({ id }: TodoPageProps) {
  const todo = await fetchJson<TodoItem>(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );

  return (
    <DefaultLayout>
      <head>
        <title>
          Todo {id}: {todo.title}
        </title>
      </head>

      <a href={`/todos/${todo.id}`}>
        {todo.completed ? '[x]' : '[ ]'} {todo.title}
      </a>
    </DefaultLayout>
  );
}
