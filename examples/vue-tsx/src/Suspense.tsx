import { defineComponent } from "vue";
import { Suspense, cache, use, useState } from "vue-hooks";

type User = { id: number; name: string };

const fetchUser = (id: number): Promise<User> =>
  new Promise((resolve) => setTimeout(() => resolve({ id, name: `user ${id}` }), 1000));

// `cache` keeps the promise identity stable across renders
const getUser = cache(fetchUser);

export const SuspenseSample = defineComponent(() => () => {
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <button onClick={() => setUserId(userId + 1)}>next user</button>
      <Suspense fallback={<p>loading...</p>}>
        <UserName userId={userId} />
      </Suspense>
    </div>
  );
});

const UserName = defineComponent(
  (props: { userId: number }) => () => {
    const user = use(getUser(props.userId));
    return <p>{user.name}</p>;
  },
  {
    props: {
      userId: { type: Number, required: true },
    },
  },
);
