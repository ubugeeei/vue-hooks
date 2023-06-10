import { defineComponent } from "vue";
import { Reducer, useReducer } from "vue-hooks";

type State = number;
type Action = { type: "increment" | "decrement" | "reset" };
const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    case "reset":
      return 0;
  }
};

export const ReducerSample = defineComponent(() => () => {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>reset</button>
    </div>
  );
});
