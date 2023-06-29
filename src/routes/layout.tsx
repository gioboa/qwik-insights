import { Slot, component$ } from "@builder.io/qwik";
import { type RequestHandler } from "@builder.io/qwik-city";

//db
import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import { initializeDbIfNeeded } from "../db";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

export const onRequest: RequestHandler = async ({ env }) => {
  await initializeDbIfNeeded(async () =>
    drizzle(
      createClient({
        url: env.get("PRIVATE_LIBSQL_DB_URL")!,
        authToken: env.get("PRIVATE_LIBSQL_DB_API_TOKEN")!,
      })
    )
  );
};

export default component$(() => {
  return (
    <main>
      <Slot />
    </main>
  );
});
