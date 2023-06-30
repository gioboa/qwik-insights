import { Slot, component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getUserFromEvent } from "~/server/auth/auth";
import { paths } from "../layout";

export const useAnonymousRoute = routeLoader$(async (event) => {
  if (await getUserFromEvent(event)) {
    throw event.redirect(302, paths.index);
  }
});

export default component$(() => {
  return <Slot />;
});
