import { defineComponent } from "vue";
import { useEffect, useState } from "vue-hooks";

export const EffectSample = defineComponent(() => () => {
  const [isShowChild, setIsShowChild] = useState(true);

  return (
    <div>
      <button onClick={() => setIsShowChild(!isShowChild)}>
        {isShowChild ? "unmount child" : "mount child"}
      </button>
      {isShowChild && <EffectSampleChild />}
    </div>
  );
});

const EffectSampleChild = defineComponent(() => () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("start new interval");
    const interval = setInterval(() => {
      console.log("interval");
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      console.log("clear interval");
      clearInterval(interval);
    };
  }, []);

  return <p> {count}</p>;
});
