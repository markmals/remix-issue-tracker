import { routes } from "#/routes.ts";
import {
    addEventListeners,
    clientEntry,
    Frame,
    Handle,
    on,
    ref,
    SerializableProps,
    TypedEventTarget,
} from "remix/ui";
import * as s from "remix/data-schema";
import { AddCommentSchema } from "#/data/schemas.ts";
import type { Comment } from "#/data/tables.ts";
import { LoadingState } from "#/assets/loading-state.tsx";
import { CommentCountEvent, IssueShownEvent } from "#/assets/comment-events.ts";

const CHANGE = "change";
const OPTIMISTIC_ADD = "optimistic-add";

interface CommentStoreEventMap {
    [CHANGE]: Event;
}

/**
 * A real {@link Event} subclass so the optimistic payload is typed at the
 * listener via `instanceof` — no cast needed to read it back off the event.
 */
class OptimisticCommentEvent extends Event {
    comment: Comment;
    constructor(comment: Comment) {
        super(OPTIMISTIC_ADD);
        this.comment = comment;
    }
}

/**
 * Client-side source of truth for the comment timeline. Holds server-confirmed
 * comments and, while a submission is in flight, an optimistic entry on top.
 */
class CommentStore extends TypedEventTarget<CommentStoreEventMap> {
    submitting = false;
    comments: Comment[];

    /**
     * Render-time sync: adopt the latest server truth unless we're holding an
     * optimistic entry. Never dispatches — it runs inside the render scope, so
     * emitting here would re-enter render forever.
     */
    sync(latest: Comment[]) {
        if (!this.submitting) {
            this.comments = latest;
        }
    }

    /**
     * Event-time: show an optimistic comment immediately and hold server truth
     * back until the reload settles.
     */
    addOptimisticComment(comment: Comment) {
        this.submitting = true;
        // new array so we never mutate the props-provided list adopted by sync()
        this.comments = [...this.comments, comment];
        this.dispatchEvent(new Event(CHANGE));
    }

    /**
     * Event-time: the frame reload finished, so release the hold and let the
     * next render adopt server truth.
     */
    settle() {
        this.submitting = false;
        this.dispatchEvent(new Event(CHANGE));
    }

    constructor(comments: Comment[] = []) {
        super();
        this.comments = comments;
    }
}

export namespace Comments {
    export interface Props extends SerializableProps {
        src: string;
        issueId: number;
    }
}

/**
 * Wraps the comments frame and its composer. Purely structural — the optimistic
 * store lives inside the frame (in {@link Timeline}); the composer reaches it
 * across the boundary via the shared {@link FrameHandle}, so no context is set.
 */
export let Comments = clientEntry(
    import.meta.url,
    function Comments(handle: Handle<Comments.Props>) {
        return () => {
            if (!IS_SERVER) {
                // This render runs as the issue's detail flushes (and the keyed
                // frame below remounts), so announce it — the sidebar highlights
                // the issue now, without waiting for the comments to finish loading.
                window.dispatchEvent(new IssueShownEvent(handle.props.issueId));
            }

            return (
                <>
                    <Frame
                        key={handle.props.issueId}
                        name="comments"
                        src={handle.props.src}
                        fallback={
                            <LoadingState
                                label="Loading comments"
                                detail="Preparing the timeline."
                            />
                        }
                    />
                    <CommentComposer issueId={handle.props.issueId} />
                </>
            );
        };
    },
);

const IS_SERVER = typeof window === "undefined";

/**
 * Rendered inside the comments frame. Owns the store and listens on its own
 * {@link FrameHandle}: an `optimistic-add` event pushes a pending comment in
 * from the composer, and the built-in `reloadComplete` event closes the loop.
 */
export let Timeline = clientEntry(
    import.meta.url,
    function Timeline(handle: Handle<{ comments: Comment[]; issueId: number }>) {
        let store = new CommentStore(handle.props.comments);

        if (!IS_SERVER) {
            // store mutations -> repaint, then broadcast the live count after
            // render-time sync (optimistic on add, real after settle). Broadcast
            // on `window`, not `frames.top`: a remounted comments frame resolves
            // `frames.top` to itself, so the sidebar would never hear it.
            addEventListeners(store, handle.signal, {
                change() {
                    handle.queueTask(signal => {
                        if (signal.aborted) return;

                        window.dispatchEvent(
                            new CommentCountEvent(handle.props.issueId, store.comments.length),
                        );
                    });
                    handle.update();
                },
            });

            // optimistic add, dispatched from the composer outside the frame
            handle.frame.addEventListener(
                OPTIMISTIC_ADD,
                event => {
                    // instanceof narrows Event -> OptimisticCommentEvent, no cast
                    if (event instanceof OptimisticCommentEvent) {
                        store.addOptimisticComment(event.comment);
                    }
                },
                { signal: handle.signal },
            );

            // reload done -> fresh server truth is in props -> release the hold
            addEventListeners(handle.frame, handle.signal, {
                reloadComplete() {
                    store.settle();
                },
            });
        }

        return () => {
            store.sync(handle.props.comments);

            return (
                <section aria-labelledby="timeline-heading" class="timeline">
                    <div class="section-heading">
                        <h3 id="timeline-heading">Timeline</h3>
                        <span>{store.comments.length} updates</span>
                    </div>
                    {store.comments.map(comment => (
                        <CommentCard comment={comment} />
                    ))}
                </section>
            );
        };
    },
);

function CommentCard(handle: Handle<{ comment: Comment }>) {
    return () => (
        <article class="comment-card">
            <div aria-hidden="true" class="avatar">
                {handle.props.comment.author.charAt(0)}
            </div>
            <div>
                <div class="comment-heading">
                    <strong>{handle.props.comment.author}</strong>
                    <span>
                        {handle.props.comment.id < 0 ? "Saving..." : handle.props.comment.time}
                    </span>
                </div>
                <p>{handle.props.comment.body}</p>
            </div>
        </article>
    );
}

/**
 * Rendered outside the frame. On submit it hands an optimistic comment across
 * the boundary by dispatching on the comments {@link FrameHandle}, then reloads
 * the frame — whose `reloadComplete` releases the optimistic hold.
 */
function CommentComposer(handle: Handle<{ issueId: number }>) {
    let textarea: HTMLTextAreaElement | undefined;

    return () => {
        let { issueId } = handle.props;

        return (
            <form
                action={routes.comments.create.href({ issueId })}
                method={routes.comments.create.method}
                class="composer"
                mix={on("submit", async event => {
                    event.preventDefault();

                    let form = event.currentTarget;
                    let formData = new FormData(form, event.submitter);
                    let { comment } = s.parse(AddCommentSchema, formData);

                    // resolve the shared frame at submit time, then hand the
                    // optimistic comment across the boundary
                    let frame = handle.frames.get("comments");
                    frame?.dispatchEvent(
                        new OptimisticCommentEvent({
                            id: -Date.now(),
                            issueId,
                            author: "Mark Malstrom",
                            // placeholder — the negative id marks this as pending, so the
                            // card shows "Saving..." instead of this value until settle
                            time: "",
                            body: comment,
                        }),
                    );
                    form.reset();

                    let requestFailed = false;

                    try {
                        let response = await fetch(form.action, {
                            body: formData,
                            method: form.method,
                        });
                        requestFailed = !response.ok;
                    } catch {
                        requestFailed = true;
                    }

                    if (requestFailed && textarea) {
                        // restore the comment in the case of an error
                        textarea.value = comment;
                    }

                    // revalidate just the comments frame; its reloadComplete event
                    // then releases the optimistic hold
                    await frame?.reload();
                })}
            >
                <label for="comment">Add a comment</label>
                <textarea
                    mix={ref(node => (textarea = node))}
                    id="comment"
                    name="comment"
                    placeholder="Leave a project update..."
                    rows={4}
                />
                <div class="composer-actions">
                    <button type="submit">Comment</button>
                </div>
            </form>
        );
    };
}
