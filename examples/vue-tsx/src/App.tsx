import { defineComponent } from "vue";
import { useState } from "vue-hooks";

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);

  const double = count * 2;

  return (
    <div>
      <div>count: {count}</div>
      <div>double: {double}</div>
      <button
        onClick={() => {
          setCount((prev) => prev + 1);
          setCount((prev) => prev + 1);
          setCount((prev) => prev + 1);
        }}
      >
        +3
      </button>
    </div>
  );
});
