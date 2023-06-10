import { defineComponent } from "vue";
import { useEffect, useMemo, useState } from "vue-hooks";

type Todo = {
  id: number;
  text: string;
  isDone: boolean;
};

const todos: Todo[] = [
  {
    id: 1,
    text: "foo",
    isDone: false,
  },
  {
    id: 2,
    text: "bar",
    isDone: true,
  },
  {
    id: 3,
    text: "baz",
    isDone: false,
  },
];

const filterTodos = (todos: Todo[], isDone: boolean) => {
  console.log("filterTodos called");
  return todos.filter((todo) => todo.isDone === isDone);
};

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);
  const double = count * 2;

  const [isDone, setIsDone] = useState(false);
  const visibleTodos = useMemo(() => filterTodos(todos, isDone), [isDone]);

  const [isShowChild, setIsShowChild] = useState(true);

  return (
    <div>
      <div>
        <div>count: {count}</div>
        <div>double: {double}</div>
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>

      <div>
        <button onClick={() => setIsDone(!isDone)}>
          {isDone ? "show not done" : "show done"}
        </button>
        <ul>
          {visibleTodos.map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
      </div>

      <div>
        <button onClick={() => setIsShowChild(!isShowChild)}>
          toggle child visibility
        </button>
        {isShowChild && <Child />}
      </div>
    </div>
  );
});

const Child = defineComponent(() => () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("interval");
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      console.log("clear interval");
      clearInterval(interval);
    };
  }, []);

  return <p> child {count}</p>;
});
