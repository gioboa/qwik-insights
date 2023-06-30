import {
  Link,
  globalAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { getUserFromEvent, updateAuthCookies } from "~/server/auth/auth";

import Layout from "~/components/layout";
import { paths } from "./layout";

export const useUser = routeLoader$((event) => {
  return getUserFromEvent(event);
});

export const useSetSessionAction = globalAction$(
  (data, event) => {
    updateAuthCookies(event, data);
  },
  zod$({
    access_token: z.string(),
    expires_in: z.coerce.number(),
    refresh_token: z.string(),
  })
);

export default component$(() => {
  const userSig = useUser();
  const navigate = useNavigate();
  const action = useSetSessionAction();

  useVisibleTask$(async () => {
    const hash = window.location.hash.substring(1);

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const expires_in = params.get("expires_in");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !expires_in || !refresh_token) {
      return;
    }

    await action.submit({
      access_token,
      expires_in: +expires_in,
      refresh_token,
    });

    if (action.value?.failed) {
      return;
    }

    navigate(paths.index);
  });

  return (
    <Layout mode="bright">
      Future home of Qwik Insights! {userSig.value?.email}
      {userSig.value?.email ? (
        <ul>
          <li>
            <Link href={paths.dashboard}>Dashboard</Link>
          </li>
          <li>
            <Link href={paths.signOut}>Sign Out</Link>
          </li>
          <li>
            <Link href="app">Apps</Link>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <Link href={paths.signIn}>Sign In</Link>
          </li>
          <li>
            <Link href={paths.signUp}>Sign Up</Link>
          </li>
        </ul>
      )}
    </Layout>
  );
});
