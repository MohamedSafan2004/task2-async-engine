# Fault-Tolerant Async Data Engine (TypeScript)

A small Node.js + TypeScript engine that fetches data from several public API endpoints at the same time, maps the raw responses into clean, strictly typed domain models, and keeps running even when some endpoints fail.

Built as part of the Elevvo Backend Internship (Task 2).

## What it demonstrates

- Strict TypeScript configuration (`strict`, `noImplicitAny`, `strictNullChecks`, and more) with no use of `any`
- Domain interfaces: `ExternalUser` describes the raw API response and `ProcessedUser` describes the clean shape used by the application
- A pure mapping function that converts one shape into the other
- Concurrent requests with `Promise.allSettled()`
- Error isolation: a failing endpoint (HTTP error or network failure) is logged, and the healthy endpoints are still processed and returned
- Native `fetch` (no external HTTP library)

## How it works

1. `FetchUsers(endpoint)` fetches one endpoint, throws on a non-OK HTTP status, and maps the JSON into `ProcessedUser[]`.
2. `main()` starts all requests together and waits for every result with `Promise.allSettled()`.
3. Fulfilled results are merged into one array. Rejected results are logged with the endpoint URL and the reason.

The demo uses three endpoints: one valid, one that returns `404`, and one domain that does not exist, to show that the failures do not stop the program.

## Requirements

- [Node.js](https://nodejs.org/) v18 or newer (for native `fetch`)

## Setup and run

```bash
npm install
npx tsc
node dist/index.js
```

`npx tsc` compiles `src/index.ts` into JavaScript inside `dist/`, and Node runs the compiled file.

## Example output

```
Failed https://jsonplaceholder.typicode.com/not-a-real-route -> HTTP 404 from https://jsonplaceholder.typicode.com/not-a-real-route
Failed https://this-domain-does-not-exist-12345.com/users -> fetch failed
Loaded 10 Users from 3 endpoints.
[
  {
    userId: 1,
    fullName: 'Leanne Graham',
    corporateEmail: 'sincere@april.biz',
    location: 'Kulas Light, Gwenborough',
    phone: '1-770-736-8031 x56442'
  },
  ...
]
```

## Project structure

```
task2-async-engine/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```
