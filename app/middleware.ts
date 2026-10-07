import type { RemixNode } from "remix/component";
import path from "node:path";

import { renderWith } from "remix/middleware/render";
import { createHtmlResponse as html } from "remix/response/html";
import { renderToStream } from "remix/component/server";
import { assert } from "remix/assert";
import { assets } from "./actions/root.ts";

export function render() {
    return renderWith(
        ({ request, router, url }) =>
            function render(node: RemixNode, init?: ResponseInit) {
                let stream = renderToStream(node, {
                    signal: request.signal,
                    async resolveClientEntry(entryId, component) {
                        assert(
                            entryId.startsWith("file://"),
                            `Expected \`import.meta.url\` for clientEntry ID, received '${entryId}'`,
                        );

                        let [filePath, fragment] = entryId.split("#");

                        // script entries resolve through import maps now, so the
                        // entry carries its own mappings and module preloads
                        let { href, importMap, preloads } =
                            await assets.getScriptEntry(filePath);

                        return {
                            href,
                            importMap,
                            preloads,
                            exportName: fragment || component.name || titleCaseFileName(filePath),
                        };
                    },
                    async resolveFrame(src, target, ctx) {
                        let frameUrl = new URL(src, ctx?.currentFrameSrc || url);

                        let headers = new Headers();
                        headers.set("Accept", "text/html");
                        headers.set("Accept-Encoding", "identity");

                        if (target) headers.set("X-Remix-Target", target);

                        let cookie = request.headers.get("Cookie");
                        if (cookie) headers.set("Cookie", cookie);

                        let response = await router.fetch(
                            new Request(frameUrl, {
                                method: "GET",
                                headers,
                                signal: request.signal,
                            }),
                        );

                        if (!response.ok) {
                            return `<pre>Frame error: ${response.status} ${response.statusText}</pre>`;
                        }

                        return response.body ?? (await response.text());
                    },
                    onError(error) {
                        console.error(error);
                    },
                });

                return html(stream, init);
            },
    );
}

function titleCaseFileName(fileUrl: string): string {
    let url = new URL(fileUrl);
    let fileName = path.basename(url.pathname, path.extname(url.pathname));
    return fileName
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map(segment => segment[0]!.toUpperCase() + segment.slice(1))
        .join("");
}

export function frameResponseInit(init?: ResponseInit): ResponseInit {
    let headers = new Headers(init?.headers);
    if (!headers.has("Cache-Control")) {
        headers.set("Cache-Control", "no-store");
    }

    return { ...init, headers };
}

export { frameResponseInit as frame };
