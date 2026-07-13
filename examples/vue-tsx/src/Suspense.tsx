import { defineComponent } from "vue";
import { Suspense, use, useState } from "vue-hooks";

type User = { id: number; name: string };

const fetchUser = (id: number): Promise<User> =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: `user ${id}` }), 1000)
  );

// the promise identity must be stable across renders
const cache = new Map<number, Promise<User>>();
const getUser = (id: number) => {
  let user = cache.get(id);
  if (!user) {
    user = fetchUser(id);
    cache.set(id, user);
  }
  return user;
};

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
  }
);
