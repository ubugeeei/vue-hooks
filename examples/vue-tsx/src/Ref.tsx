import { defineComponent } from "vue";
import { useState, useRef } from "vue-hooks";

export const RefSample = defineComponent(() => () => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startInterval = () => {
    if (intervalRef.current !== null) {
      console.warn("interval already started");
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
  };

  const stopInterval = () => {
    if (intervalRef.current === null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div>
      <div>count: {count}</div>
      <button onClick={startInterval}>start interval</button>
      <button onClick={stopInterval}>stop interval</button>
    </div>
  );
});
