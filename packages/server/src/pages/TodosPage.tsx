import { DefaultLayout } from '../layouts/DefaultLayout';
import { fetchJson } from '../utils/fetchUtils';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export async function TodosPage() {
  const todos = await fetchJson<Todo[]>('https://jsonplaceholder.typicode.com/todos');

  return (
    <DefaultLayout>
      <head>
        <title>Todos</title>
      </head>
      <ul>
        {todos.map((todo) => (
          <li>
            <a href={`/todos/${todo.id}`}>
              {todo.completed ? '[x]' : '[ ]'} {todo.title}
            </a>
          </li>
        ))}
      </ul>
    </DefaultLayout>
  );
}
