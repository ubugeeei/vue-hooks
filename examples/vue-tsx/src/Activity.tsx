import { defineComponent } from "vue";
import { Activity, useState } from "vue-hooks";

export const ActivitySample = defineComponent(() => () => {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>{visible ? "hide" : "show"}</button>
      <Activity mode={visible ? "visible" : "hidden"}>
        <ActivityCounter />
      </Activity>
    </div>
  );
});

const ActivityCounter = defineComponent(() => () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>count: {count} (state is preserved while hidden)</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
});
