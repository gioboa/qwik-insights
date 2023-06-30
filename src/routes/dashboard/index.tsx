import Layout from "~/components/layout";
import { component$ } from "@builder.io/qwik";
import { getUserFromEvent } from "~/server/auth/auth";
import { paths } from "../layout";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useAuthRoute = routeLoader$(async (event) => {
  const user = await getUserFromEvent(event);
  if (!user) {
    throw event.redirect(302, paths.index);
  }
  return user;
});

export default component$(() => {
  const userSig = useAuthRoute();
  return <Layout>User {userSig.value.email}</Layout>;
});
