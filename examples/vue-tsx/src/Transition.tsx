import { defineComponent } from "vue";
import { ViewTransition, addTransitionType, useState, useTransition } from "vue-hooks";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Tab = "home" | "about";

export const TransitionSample = defineComponent(() => () => {
  const [tab, setTab] = useState<Tab>("home");
  const [isPending, startTransition] = useTransition();

  const select = (next: Tab) => {
    startTransition(async () => {
      addTransitionType(`to-${next}`);
      await sleep(500); // simulate loading the next tab
      setTab(next);
    });
  };

  return (
    <div>
      <button disabled={tab === "home"} onClick={() => select("home")}>
        home
      </button>
      <button disabled={tab === "about"} onClick={() => select("about")}>
        about
      </button>
      {isPending && <span> loading...</span>}
      <ViewTransition name="tab-panel">
        <p>{tab === "home" ? "Welcome home!" : "vue-hooks: React hooks for Vue."}</p>
      </ViewTransition>
    </div>
  );
});
