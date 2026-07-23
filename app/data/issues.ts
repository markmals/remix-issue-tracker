import { setTimeout } from "node:timers/promises";

import { db } from "#/data/db.ts";
import { Comments, Issues, type Issue } from "#/data/tables.ts";

export async function getIssues() {
    await setTimeout(400);
    return await db.findMany(Issues, { orderBy: ["id", "desc"] });
}

export async function getIssue(id: number) {
    await setTimeout(400);
    return await db.findOne(Issues, { where: { id } });
}

export async function getComments(issueId: number) {
    await setTimeout(1000);
    return await db.findMany(Comments, {
        where: { issueId },
        orderBy: ["id", "asc"],
    });
}

export async function addComment(issueId: number, body: string) {
    await setTimeout(2000);
    let issue = await db.findOne(Issues, { where: { id: issueId } });

    if (!issue) {
        throw new Error(`Issue ${issueId} not found`);
    }

    await db.create(Comments, {
        issueId,
        author: "Mark Malstrom",
        time: new Date().toISOString(),
        body,
    });

    await db.update(Issues, issueId, { comments: issue.comments + 1 });

    return await getComments(issueId);
}

/**
 * Seed the database with sample issues and comments when empty.
 * Idempotent: a no-op once the issues table has any rows.
 */
export async function seedIssues() {
    let count = await db.count(Issues);

    if (count > 0) {
        return;
    }

    await db.createMany(Issues, SEED_ISSUES);

    for (let [issueId, comments] of Object.entries(SEED_COMMENTS)) {
        for (let comment of comments) {
            await db.create(Comments, { ...comment, issueId: Number(issueId) });
        }
    }
}

const SEED_ISSUES: Issue[] = [
    {
        id: 42,
        title: "Comment timeline duplicates after reconnect",
        area: "sync",
        status: "Open",
        author: "Maya Chen",
        updated: "8 min ago",
        comments: 3,
        reactions: 27,
        active: true,
        assignee: "Maya Chen",
        milestone: "3.0.0-beta.2",
        priority: "High",
        description:
            "The comment timeline duplicates after reconnect. We need to fix this so the timeline is not duplicated.",
    },
    {
        id: 39,
        title: "Label filter should preserve selected issue",
        area: "routing",
        status: "Open",
        author: "Jon Bell",
        updated: "32 min ago",
        comments: 2,
        reactions: 9,
        active: false,
        assignee: "Jon Bell",
        milestone: "3.0.0-beta.2",
        priority: "High",
        description:
            "The label filter should preserve the selected issue. We need to fix this so the issue is still selected when the filter is applied.",
    },
    {
        id: 37,
        title: "New assignee menu needs keyboard focus states",
        area: "accessibility",
        status: "Review",
        author: "Priya Shah",
        updated: "1 hr ago",
        comments: 2,
        reactions: 12,
        active: false,
        assignee: "Priya Shah",
        milestone: "3.0.0-beta.2",
        priority: "High",
        description:
            "The new assignee menu needs keyboard focus states. We need to fix this so the menu is accessible.",
    },
    {
        id: 31,
        title: "Milestone progress card overflows on mobile",
        area: "design",
        status: "Open",
        author: "Alex Kim",
        updated: "Yesterday",
        comments: 2,
        reactions: 5,
        active: false,
        assignee: "Alex Kim",
        milestone: "3.0.0-beta.2",
        priority: "High",
        description:
            "The milestone progress card overflows on mobile. We need to fix this so the card doesn't break the layout.",
    },
];

const SEED_COMMENTS: Record<number, { author: string; time: string; body: string }[]> = {
    42: [
        {
            author: "Maya Chen",
            time: "8 min ago",
            body: "The reconnect path is replaying the latest server event after the local cache has already applied it.",
        },
        {
            author: "Eli Park",
            time: "5 min ago",
            body: "I can reproduce this with two tabs open. It only happens when the second tab regains focus first.",
        },
        {
            author: "Noah Reed",
            time: "Just now",
            body: "Let's keep the detail panel and comments panel separate so each can get its own data path later.",
        },
    ],
    39: [
        {
            author: "Jon Bell",
            time: "29 min ago",
            body: "The route picks up the new query correctly, but the selected issue state gets reset when the filtered list re-renders.",
        },
        {
            author: "Maya Chen",
            time: "20 min ago",
            body: "Let's preserve the selected id and only fall back to the first issue if it is no longer in the filtered results.",
        },
    ],
    37: [
        {
            author: "Priya Shah",
            time: "58 min ago",
            body: "The menu items are reachable with Tab, but the current focus ring is too subtle against the dark panel.",
        },
        {
            author: "Alex Kim",
            time: "44 min ago",
            body: "I can pair on the visual treatment once the keyboard states are wired up.",
        },
    ],
    31: [
        {
            author: "Alex Kim",
            time: "Yesterday",
            body: "The overflow starts below 420px wide when the progress label and percentage wrap onto separate lines.",
        },
        {
            author: "Noah Reed",
            time: "Yesterday",
            body: "A stacked layout for the progress metadata should keep the card readable on smaller screens.",
        },
    ],
};
