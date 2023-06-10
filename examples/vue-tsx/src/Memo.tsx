import { defineComponent } from "vue";
import { useMemo, useState } from "vue-hooks";

type Todo = {
  id: number;
  text: string;
  isDone: boolean;
};

const TODO_LIST: Todo[] = [
  { id: 1, text: "foo", isDone: false },
  { id: 2, text: "bar", isDone: true },
  { id: 3, text: "baz", isDone: false },
];

const filterTodos = (todos: Todo[], isDone: boolean) => {
  console.log("filterTodos called");
  return todos.filter((todo) => todo.isDone === isDone);
};

export const MemoSample = defineComponent(() => () => {
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const visibleTodos = useMemo(() => filterTodos(TODO_LIST, isDone), [isDone]);

  return (
    <div>
      <div>
        <div>count: {count}</div>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>

      <button onClick={() => setIsDone(!isDone)}>
        {isDone ? "show not done" : "show done"}
      </button>
      <ul>
        {visibleTodos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
});
