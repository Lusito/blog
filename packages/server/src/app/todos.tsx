import { h } from 'tsx-ssr';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export async function Todos() {
  const promise = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos: Todo[] = await promise.json();

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
