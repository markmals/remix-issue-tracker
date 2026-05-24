import { IssueColumn } from "#/components/issue-column.tsx";
import { issues } from "#/data/data.ts";
import { routes } from "#/routes.ts";
import { getContext } from "remix/middleware/async-context";
import { Frame } from "remix/ui";

export function Document() {
    let { url } = getContext();

    return () => (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                <title>New Remix App</title>

                <link href="/favicon.ico" rel="icon" sizes="32x32" type="image/x-icon" />
                <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />

                <link
                    href={routes.assets.href({ path: "app/assets/index.css" })}
                    rel="stylesheet"
                />
                <script
                    async
                    src={routes.assets.href({ path: "app/assets/entry.ts" })}
                    type="module"
                />
            </head>
            <body>
                <div id="root">
                    <main class="app-shell">
                        <IssueColumn issues={issues} />
                        <Frame name="detail" src={url.toString()} />
                    </main>
                </div>
            </body>
        </html>
    );
}
