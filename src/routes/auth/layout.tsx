import { Slot, component$ } from "@builder.io/qwik";

import Layout from "~/components/layout";
import { getUserFromEvent } from "~/server/auth/auth";
import { paths } from "../layout";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useAnonymousRoute = routeLoader$(async (event) => {
  if (await getUserFromEvent(event)) {
    throw event.redirect(302, paths.index);
  }
});

export default component$(() => {
  return (
    <Layout>
      <Slot />
    </Layout>
  );
});
