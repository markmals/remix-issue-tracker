import { run } from "remix/ui";

run({
    async loadModule(moduleUrl, exportName) {
        let mod = await import(moduleUrl);
        let exported = mod[exportName];

        if (typeof exported !== "function") {
            throw new TypeError(
                `Expected export '${exportName}' from '${moduleUrl}' to be a function`,
            );
        }

        return exported;
    },
    // kept (rather than falling back to the default resolver) for two reasons: it
    // sends the app's own `X-Remix-Target` header, and it renders non-OK frame
    // responses instead of throwing — a 404 issue renders its "Not Found" body.
    async resolveFrame(src, options) {
        let { signal, target } = options ?? {};
        let headers = new Headers({ accept: "text/html" });
        if (target) headers.set("X-Remix-Target", target);
        let response = await fetch(src, { headers, signal });
        return response.body ?? (await response.text());
    },
});
