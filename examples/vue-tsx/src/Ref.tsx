import { defineComponent } from "vue";
import { useState, useRef } from "vue-hooks";

export const RefSample = defineComponent(() => () => {
  console.log("render RefSample");
  const [count, setCount] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startInterval = () => {
    if (intervalRef.value !== null) {
      console.warn("interval already started");
      return;
    }
    intervalRef.value = window.setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
  };

  const stopInterval = () => {
    if (intervalRef.value === null) return;
    clearInterval(intervalRef.value);
    intervalRef.value = null;
  };

  return (
    <div>
      <div>count: {count}</div>
      <button onClick={startInterval}>start interval</button>
      <button onClick={stopInterval}>stop interval</button>
    </div>
  );
});

export const ElementRefSample = defineComponent(() => () => {
  const inputRef = useRef<HTMLInputElement | undefined>(undefined);

  const focusInput = () => {
    if (inputRef.value === null) return;
    inputRef.value?.focus();
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>focus input</button>
    </div>
  );
});
