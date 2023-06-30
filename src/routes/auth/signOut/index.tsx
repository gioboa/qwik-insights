import { component$ } from "@builder.io/qwik";
import type { RequestEvent } from "@builder.io/qwik-city";
import { paths } from "~/routes/layout";
import { removeAuthCookies } from "~/server/auth/auth";

export const onGet = (event: RequestEvent) => {
  removeAuthCookies(event);

  throw event.redirect(302, paths.index);
};

export default component$(() => {
  return <span>Bye</span>;
});
