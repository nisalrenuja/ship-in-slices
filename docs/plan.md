# Task priority and due-date implementation

Add optional `low`, `medium`, or `high` priorities and optional valid `YYYY-MM-DD` due dates to tasks. Omitted priority defaults to `medium`. `GET /tasks` supports priority filtering and due-date sorting in ascending or descending order, with undated tasks last. Invalid task metadata and query options return HTTP 400 with `{ error: "message" }`.

The feature is delivered in three stacked pull requests. Keep domain behavior in `src/tasks.js`, HTTP validation and routing in `src/app.js`, and the UI in `public/index.html`.

## Slice 1: Data model and task behavior

- **Files:** `src/tasks.js`, `tests/tasks.test.js`
- **Includes:** Priority/due-date validation and defaults; task-layer filtering by priority and sorting by due date.
- **Tests:** Valid and invalid priorities/dates, defaults, filtering, ascending/descending sorting, undated tasks last, combined filter/sort behavior, and `tasks.reset()` in `beforeEach`.
- **Changed lines:** Keep the complete PR diff under 200 changed lines.

## Slice 2: HTTP API

- **Files:** `src/app.js`, `tests/app.test.js`
- **Includes:** Parse and validate creation fields and list query parameters, return 400 errors for invalid input, and pass valid filter/sort options to `tasks.list()`. The only production source file changed in this slice is `src/app.js`.
- **Tests:** Task creation with valid and invalid metadata; priority filter; ascending/descending due-date sort; undated tasks last; combined filter and sort; invalid query values; `tasks.reset()` in `beforeEach`.
- **Changed lines:** Keep the complete PR diff under 200 changed lines.

## Slice 3: UI

- **Files:** `public/index.html`, `src/app.js`, `tests/app.test.js`
- **Includes:** Serve the page at `/`; provide task creation fields, priority filtering, due-date sorting, and task listing.
- **Tests:** Verify `GET /` serves the page with the expected form and filter/sort controls; run the existing API and task tests as well.
- **Changed lines:** Keep the complete PR diff under 200 changed lines.

Run `npm test` at each stack layer. Count changed lines independently in each PR's diff before submission; use `gh stack` to maintain the model → API → UI stack.
