import { setTimeout } from "node:timers/promises";

import { commentsByIssueId, issues } from "./data.ts";

export async function getIssues() {
    await setTimeout(400);
    // TODO: Implement using remix/data-table instead
    return structuredClone(issues);
}

export async function getComments(issueId: number) {
    await setTimeout(400);
    // TODO: Implement using remix/data-table instead
    return structuredClone(commentsByIssueId[issueId] ?? []);
}

export async function addComment(issueId: number, comment: string) {
    await setTimeout(2000);
    // TODO: Implement using remix/data-table instead
    commentsByIssueId[issueId].push({
        author: "Brenley Dueck",
        time: new Date().toISOString(),
        body: comment,
    });
    return commentsByIssueId[issueId];
}
