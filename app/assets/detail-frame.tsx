import { clientEntry, Frame, Handle } from "remix/ui";

/**
 * Wraps the detail frame so we can dim the outgoing issue while the next one
 * loads. The frame's own handle announces `reloadStart` when a navigation
 * targets it and `reloadComplete` when the new content has rendered — the
 * exact pending window Brenley covers with `isPending` in Solid.
 */
export let DetailFrame = clientEntry(
    import.meta.url,
    function DetailFrame(handle: Handle<{ src: string }>) {
        let pending = false;

        function settle() {
            if (pending) {
                pending = false;
                handle.update();
            }
        }

        if (typeof window !== "undefined") {
            // the new issue is on screen the moment its comments island renders —
            // settle then, not when the reload stream closes (the nested comments
            // frame keeps it open while the timeline loads)
            window.addEventListener("issueshown", settle, { signal: handle.signal });

            // the frame mounts during this island's first render, so resolve
            // its handle in a task that runs after the DOM has been updated
            handle.queueTask(() => {
                let frame = handle.frames.get("detail");
                if (!frame) return;

                frame.addEventListener(
                    "reloadStart",
                    () => {
                        pending = true;
                        handle.update();
                    },
                    { signal: handle.signal },
                );

                // backstop for detail content that never announces an issue
                // (e.g. a not-found response renders no comments island)
                frame.addEventListener("reloadComplete", settle, { signal: handle.signal });
            });
        }

        return () => (
            <div class={pending ? "detail-slot pending" : "detail-slot"}>
                <Frame name="detail" src={handle.props.src} />
            </div>
        );
    },
);
