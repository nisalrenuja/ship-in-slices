# Team rules for ship-in-slices

## Pull requests
- Keep every pull request under 200 changed lines.
- Split features into stacked pull requests: data layer first, then API, then UI.
- Each layer must pass `npm test` on its own.

## Code style
- Business logic lives in src/tasks.js; src/app.js only handles HTTP.
- Validate input in the route and return 400 with { error: "message" }.
- Use camelCase for functions and fields.

## Tests
- Every new function or endpoint gets a Jest test in tests/.
- Call tasks.reset() in beforeEach.

## Tools
- Use `gh stack` for stacked pull requests, never manual base-branch edits.
