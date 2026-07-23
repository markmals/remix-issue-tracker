const ISSUE_SHOWN = "issueshown";

/**
 * Broadcast on `window` when the comments island renders for an issue — i.e. the
 * moment that issue's detail (title) is on screen, before its comments finish
 * loading. The sidebar uses it to move the active highlight without waiting for
 * the whole navigation transition to settle.
 */
export class IssueShownEvent extends Event {
    issueId: number;
    constructor(issueId: number) {
        super(ISSUE_SHOWN);
        this.issueId = issueId;
    }
}

const COMMENT_COUNT = "commentcount";

/**
 * Broadcast on `window` whenever an issue's live comment count changes —
 * optimistically on submit and again once the reload settles. The sidebar
 * {@link IssueCard} listens for it and updates without revalidating the document.
 */
export class CommentCountEvent extends Event {
    issueId: number;
    count: number;
    constructor(issueId: number, count: number) {
        super(COMMENT_COUNT);
        this.issueId = issueId;
        this.count = count;
    }
}

/**
 * Register the custom events on the global {@link WindowEventMap}, so
 * `window.addEventListener("comment-count", …)` and `dispatchEvent` are fully
 * typed at every call site — no `instanceof` narrowing and no event-name
 * constants to pass around. This works because `WindowEventMap` is an
 * `interface` (open to declaration merging); the frame's `optimistic-add`
 * event can't do the same yet because `FrameHandleEventMap` is a `type` alias.
 */
declare global {
    interface WindowEventMap {
        [ISSUE_SHOWN]: IssueShownEvent;
        [COMMENT_COUNT]: CommentCountEvent;
    }
}
