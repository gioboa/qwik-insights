import { component$ } from "@builder.io/qwik";
import { Form, globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { paths } from "~/routes/layout";
import { updateAuthCookies } from "~/server/auth/auth";
import { createSupabase } from "~/server/auth/supabase";
import { useAnonymousRoute } from "../layout";

export const useSignInPasswordAction = globalAction$(
  async (data, event) => {
    const supabase = createSupabase(event);

    const result = await supabase.auth.signInWithPassword(data);

    if (result.error || !result.data.session) {
      const status = result.error?.status || 400;
      return event.fail(status, {
        formErrors: [result.error?.message],
      });
    }

    updateAuthCookies(event, result.data.session);

    throw event.redirect(302, paths.index);
  },
  zod$({
    email: z.string().email(),
    password: z.string(),
  })
);

export default component$(() => {
  useAnonymousRoute();
  const action = useSignInPasswordAction();

  return (
    <div>
      <h1>Sign In</h1>
      <div>
        <Form action={action}>
          <h2>Sign in with password</h2>

          <div>
            <label for="email">
              <span>Email</span>
            </label>
            <input id="email" placeholder="Email" name="email" type="email" />
            <span>{action.value?.fieldErrors?.email?.[0]}</span>
          </div>

          <div>
            <label for="password">
              <span>Password</span>
            </label>
            <input id="password" name="password" type="password" />
            <span>{action.value?.fieldErrors?.password?.[0]}</span>
          </div>

          <span>{action.value?.formErrors?.[0]}</span>
          <button type="submit">Sign In</button>
        </Form>
      </div>
    </div>
  );
});
