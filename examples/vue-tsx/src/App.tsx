import { defineComponent } from "vue";
import { EffectSample } from "./Effect";
import { ElementRefSample, RefSample } from "./Ref";
import { StateSample } from "./State";
import { MemoSample } from "./Memo";
import { CallBackSample } from "./Callback";
import { ReducerSample } from "./Reducer";
import { ContextSample } from "./Context";
import { SuspenseSample } from "./Suspense";
import { ActionStateSample } from "./ActionState";
import { TransitionSample } from "./Transition";
import { DeferredValueSample } from "./DeferredValue";
import { OptimisticSample } from "./Optimistic";
import { ActivitySample } from "./Activity";
import { SyncExternalStoreSample } from "./SyncExternalStore";

export default defineComponent(() => () => {
  return (
    <div>
      <h1>useState</h1>
      <StateSample />
      <hr />

      <h1>useMemo</h1>
      <MemoSample />
      <hr />

      <h1>useCallBack</h1>
      <CallBackSample />
      <hr />

      <h1>useEffect</h1>
      <EffectSample />
      <hr />

      <h1>useRef</h1>
      <RefSample />
      <hr />

      <h1>useElementRef</h1>
      <ElementRefSample />
      <hr />

      <h1>useReducer</h1>
      <ReducerSample />
      <hr />

      <h1>useContext</h1>
      <ContextSample />
      <hr />

      <h1>use / Suspense</h1>
      <SuspenseSample />
      <hr />

      <h1>useActionState</h1>
      <ActionStateSample />
      <hr />

      <h1>useTransition / ViewTransition</h1>
      <TransitionSample />
      <hr />

      <h1>useDeferredValue</h1>
      <DeferredValueSample />
      <hr />

      <h1>useOptimistic / Form / useFormStatus</h1>
      <OptimisticSample />
      <hr />

      <h1>Activity</h1>
      <ActivitySample />
      <hr />

      <h1>useSyncExternalStore</h1>
      <SyncExternalStoreSample />
    </div>
  );
});
