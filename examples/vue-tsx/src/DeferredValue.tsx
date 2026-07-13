import { defineComponent } from "vue";
import { useDeferredValue, useMemo, useState } from "vue-hooks";

const items = Array.from({ length: 3000 }, (_, i) => `item ${i}`);

export const DeferredValueSample = defineComponent(() => () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // the heavy filtering only re-runs when the deferred value catches up
  const results = useMemo(
    () => items.filter((item) => item.includes(deferredQuery)).slice(0, 5),
    [deferredQuery],
  );

  return (
    <div>
      <input value={query} onInput={(e) => setQuery((e.target as HTMLInputElement).value)} />
      <p>
        query: "{query}" / deferred: "{deferredQuery}"
      </p>
      <ul>
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
});
