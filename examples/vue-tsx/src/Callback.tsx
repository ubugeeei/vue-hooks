import { PropType, defineComponent } from "vue";
import { useCallback, useState } from "vue-hooks";

export const CallBackSample = defineComponent(() => () => {
  const handleClick = (e: MouseEvent) => {
    console.log(e);
  };
  const memoizedCallback = useCallback((e: MouseEvent) => {
    console.log(e);
  }, []);

  const [count, setCount] = useState(0);

  return (
    <div>
      <Btn onClick={handleClick} />
      <Btn onClick={memoizedCallback} />
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
});

const Btn = defineComponent(
  ({ onClick }) =>
    () => {
      console.log("rendered");
      return <button onClick={onClick}>Click</button>;
    },
  {
    props: {
      onClick: { type: Function as PropType<(payload: MouseEvent) => void> },
    },
  }
);
