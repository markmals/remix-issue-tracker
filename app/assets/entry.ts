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
    async resolveFrame(src, signal, target) {
        let headers = new Headers({ accept: "text/html" });
        if (target) headers.set("X-Remix-Target", target);
        let response = await fetch(src, { headers, signal });
        return response.body ?? (await response.text());
    },
});
