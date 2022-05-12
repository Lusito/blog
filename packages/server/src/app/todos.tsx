import { h } from 'tsx-ssr';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export async function Todos() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  if (response.status > 300) throw new Error('Failed loading todos');

  const todos: Todo[] = await response.json();

  return (
    <ul>
      {todos.map((todo) => (
        <li id={todo.id.toString()}>
          {todo.completed ? '[x]' : '[ ]'} {todo.title}
        </li>
      ))}
    </ul>
  );
}
