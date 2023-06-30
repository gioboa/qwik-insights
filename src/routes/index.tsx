import { component$ } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { getUserFromEvent } from "~/server/auth/auth";
import { paths } from "./layout";

export const useUser = routeLoader$((event) => {
  return getUserFromEvent(event);
});

export default component$(() => {
  const userSig = useUser();

  return (
    <div>
      Future home of Qwik Insights! {userSig.value?.email}
      {userSig.value?.email ? (
        <ul>
          <li>
            <Link href={paths.dashboard}>Dashboard</Link>
          </li>
          <li>
            <Link href={paths.signOut}>Sign Out</Link>
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
    </div>
  );
});
