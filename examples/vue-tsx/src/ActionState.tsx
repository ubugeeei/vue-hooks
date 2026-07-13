import { defineComponent } from "vue";
import { useActionState } from "vue-hooks";

const addToCart = async (prev: string[], item: string): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [...prev, item];
};

export const ActionStateSample = defineComponent(() => () => {
  const [items, dispatch, isPending] = useActionState(addToCart, [] as string[]);

  return (
    <div>
      <button disabled={isPending} onClick={() => dispatch("apple")}>
        add apple
      </button>
      {isPending && <p>adding...</p>}
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
});
