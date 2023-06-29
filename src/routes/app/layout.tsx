import { component$, Slot } from "@builder.io/qwik";
import "./page.css";

export default component$(() => {
  return (
    <section class='max-width-wrapper'>
      <Slot />
    </section>
  );
});
