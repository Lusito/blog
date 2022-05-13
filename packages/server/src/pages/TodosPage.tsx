import { DefaultLayout } from '../layouts/DefaultLayout';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export async function TodosPage() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  if (response.status > 300) throw new Error('Failed loading todos');

  const todos: Todo[] = await response.json();

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
