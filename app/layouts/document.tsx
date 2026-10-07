import { assets } from "#/actions/root.ts";
import { DetailFrame } from "#/assets/detail-frame.tsx";
import { IssueColumn } from "#/components/issue-column.tsx";
import type { Issue } from "#/data/tables.ts";
import { getContext } from "remix/middleware/async-context";
import { Handle } from "remix/component";
import { ImportMap } from "remix/component/server";

const [STYLESHEET_HREF, ENTRY] = await Promise.all([
    assets.getHref("app/assets/index.css"),
    assets.getScriptEntry("app/assets/entry.ts"),
]);

export function Document(handle: Handle<{ issues: readonly Issue[]; selectedIssue: number }>) {
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
                    href={STYLESHEET_HREF}
                    rel="stylesheet"
                />
                <ImportMap value={ENTRY.importMap} />
                {ENTRY.preloads.map(preload => (
                    <link href={preload} rel="modulepreload" />
                ))}
                <script
                    async
                    src={ENTRY.href}
                    type="module"
                />
            </head>
            <body>
                <div id="root">
                    <main class="app-shell">
                        <IssueColumn
                            issues={handle.props.issues}
                            selectedIssue={handle.props.selectedIssue}
                        />
                        <DetailFrame src={url.toString()} />
                    </main>
                </div>
            </body>
        </html>
    );
}
