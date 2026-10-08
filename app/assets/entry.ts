import { run } from "remix/component";
import {
    detectMultipleImportMapSupport,
    importModule,
    preloadShim,
} from "remix/multiple-import-maps-polyfill";

run({
    async loadModule(moduleUrl, exportName) {
        // frame responses bring their own import maps, so client entry modules
        // go through `importModule()`: native where multiple import maps are
        // supported, the polyfill everywhere else
        let mod = await importModule(moduleUrl);
        let exported = mod[exportName];

        if (typeof exported !== "function") {
            throw new TypeError(
                `Expected export '${exportName}' from '${moduleUrl}' to be a function`,
            );
        }

        return exported;
    },
    async processClientEntryPreloads(preloads) {
        if (await detectMultipleImportMapSupport()) return preloads;

        // the polyfill fetches these itself; handing them back would make the
        // browser preload URLs it can't resolve yet
        preloadShim(preloads);
        return [];
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
