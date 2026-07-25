# Remix 3 Issue Tracker

Companion demo for the "Learning Remix 3" article. The app adapts Brenley Dueck's Solid 2.0 issue tracker to Remix 3.

## Branches

- `blank` is the starting point used at the beginning of the article.
- `complete` contains the finished implementation.

## Requirements

- Node.js 24.3 or newer
- pnpm 11

## Run locally

The repository uses `complete` by default. To follow the article from its starting point, switch to `blank` before installing dependencies:

```sh
git clone https://github.com/markmals/remix-issue-tracker.git
cd remix-issue-tracker
git switch blank
pnpm install
pnpm dev
```

To run the finished app, omit `git switch blank` or switch back with `git switch complete` before installing dependencies.

Open [http://localhost:1616](http://localhost:1616) in your browser. On the `complete` branch, `pnpm dev` applies pending SQLite migrations before starting the server.
