export function frameResponseInit(init?: ResponseInit): ResponseInit {
    let headers = new Headers(init?.headers);
    if (!headers.has("Cache-Control")) {
        headers.set("Cache-Control", "no-store");
    }

    return { ...init, headers };
}

export { frameResponseInit as frame };
