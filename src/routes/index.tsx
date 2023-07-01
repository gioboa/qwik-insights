import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { getUserFromEvent, updateAuthCookies } from "~/server/auth/auth";
import {
  globalAction$,
  routeLoader$,
  useNavigate,
  z,
  zod$,
} from "@builder.io/qwik-city";

import AppsIcon from "~/components/icons/apps";
import Button from "~/components/button";
import GithubIcon from "~/components/icons/github";
import Layout from "~/components/layout";
import { createSupabase } from "~/server/auth/supabase";
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

export const useGitHubAction = globalAction$(async (_, event) => {
  const supabase = createSupabase(event);

  const response = await supabase.auth.signInWithOAuth({
    provider: "github",
  });
  return {
    success: true,
    url: response.data.url || "",
  };
});

export default component$(() => {
  const userSig = useUser();
  const navigate = useNavigate();
  const action = useSetSessionAction();
  const gitHubAction = useGitHubAction();

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

    navigate(paths.dashboard);
  });

  return (
    <Layout mode="bright">
      <h1>Log in to Qwik Insights </h1>

      {userSig.value?.email ? (
        <Button onClick$={() => navigate(paths.dashboard)}>
          <AppsIcon /> Go to the Dashboard
        </Button>
      ) : (
        <Button
          theme="github"
          onClick$={async () => {
            const { value } = await gitHubAction.submit();
            window.open(value.url, "_self");
          }}
        >
          <GithubIcon />
          Continue with GitHub
        </Button>
      )}

      {/* Future home of Qwik Insights! {userSig.value?.email}{" "}
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
      )} */}
    </Layout>
  );
});
