import { defineComponent } from "vue";
import { useEffect, useState } from "vue-hooks";

export default defineComponent(() => () => {
  const [count, setCount] = useState(0);
  const double = count * 2;
  useEffect(() => {
    console.log("render component");
  }, []);

  return (
    <div>
      <div>count: {count}</div>
      <div>double: {double}</div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +3
      </button>
    </div>
  );
});
