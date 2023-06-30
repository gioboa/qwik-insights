import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getUserFromEvent } from "~/server/auth/auth";
import { paths } from "../layout";

export const useAuthRoute = routeLoader$(async (event) => {
  const user = await getUserFromEvent(event);
  if (!user) {
    throw event.redirect(302, paths.index);
  }
  return user;
});

export default component$(() => {
  const userSig = useAuthRoute();
  return <div>User {userSig.value.email}</div>;
});
