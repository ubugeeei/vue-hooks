import { defineComponent } from "vue";
import { EffectSample } from "./Effect";
import { ElementRefSample, RefSample } from "./Ref";
import { StateSample } from "./State";
import { MemoSample } from "./Memo";
import { CallBackSample } from "./Callback";
import { ReducerSample } from "./Reducer";
import { ContextSample } from "./Context";

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
    </div>
  );
});
