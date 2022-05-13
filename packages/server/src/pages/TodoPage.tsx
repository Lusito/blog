import { DefaultLayout } from '../layouts/DefaultLayout';

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
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  if (response.status > 300) throw new Error('Failed loading todos');

  const todo: TodoItem = await response.json();

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
