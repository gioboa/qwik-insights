import "./page.css";

import { Slot, component$ } from "@builder.io/qwik";

import Layout from "~/components/layout";

export default component$(() => {
  return (
    <Layout>
      <Slot />
    </Layout>
  );
});
