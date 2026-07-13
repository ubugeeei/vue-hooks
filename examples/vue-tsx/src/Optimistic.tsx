import { defineComponent } from "vue";
import { Form, useFormStatus, useOptimistic, useState } from "vue-hooks";

const send = async (message: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return message;
};

export const OptimisticSample = defineComponent(() => () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [optimisticMessages, addOptimistic] = useOptimistic(messages, (current, m: string) => [
    ...current,
    `${m} (sending...)`,
  ]);

  const action = async (formData: FormData) => {
    const value = formData.get("message");
    const message = typeof value === "string" ? value : "";
    if (!message) return;
    addOptimistic(message);
    const sent = await send(message);
    setMessages((prev) => [...prev, sent]);
  };

  return (
    <div>
      <ul>
        {optimisticMessages.map((message, idx) => (
          <li key={idx}>{message}</li>
        ))}
      </ul>
      <Form action={action}>
        <input name="message" />
        <SubmitButton />
      </Form>
    </div>
  );
});

const SubmitButton = defineComponent(() => () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "sending..." : "send"}
    </button>
  );
});
