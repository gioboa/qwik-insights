import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { EditIcon } from "~/components/icons/edit";
import { ErrorIcon } from "~/components/icons/error";
import { SlowIcon } from "~/components/icons/slow";
import { SymbolIcon } from "~/components/icons/symbol";
import { applicationTable, getDB } from "~/db";
import { AppLink } from "~/routes.config";
import "./page.css";

export const useApps = routeLoader$(async () => {
  const db = getDB();
  return await db
    .select()
    .from(applicationTable)
    .orderBy(applicationTable.name)
    .all();
});

export default component$(() => {
  const apps = useApps();
  return (
    <div class='app-table-container'>
      <h1>Apps</h1>
      <span>
        [{" "}
        <AppLink route='/app/[publicApiKey]/edit/' param:publicApiKey='__new__'>
          new
        </AppLink>{" "}
        ]
      </span>

      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>API Key</th>
            <th></th>
          </tr>
          {apps.value.map((app) => (
            <tr key={app.id}>
              <td>
                <AppLink
                  route='/app/[publicApiKey]/'
                  param:publicApiKey={app.publicApiKey}
                >
                  {app.name}
                </AppLink>
              </td>
              <td>{app.description}</td>
              <td>
                <code>{app.publicApiKey}</code>
              </td>
              <td>
                <ul role='list'>
                  <li>
                    <AppLink
                      route='/app/[publicApiKey]/symbols/'
                      param:publicApiKey={app.publicApiKey}
                    >
                      <SymbolIcon />
                    </AppLink>
                  </li>
                  <li>
                    <AppLink
                      route='/app/[publicApiKey]/symbols/slow/'
                      param:publicApiKey={app.publicApiKey}
                    >
                      <SlowIcon />
                    </AppLink>
                  </li>
                  <li>
                    <AppLink
                      route={`/app/[publicApiKey]/errors/`}
                      param:publicApiKey={app.publicApiKey}
                    >
                      <ErrorIcon />
                    </AppLink>
                  </li>
                  <li>
                    <AppLink
                      route={`/app/[publicApiKey]/edit/`}
                      param:publicApiKey={app.publicApiKey}
                    >
                      <EditIcon />
                    </AppLink>
                  </li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
