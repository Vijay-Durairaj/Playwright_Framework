# Architecture

This repository follows a layered Playwright + TypeScript test framework.

## Folder Responsibilities

- `src/tests/`: Test specs and test-only fixtures.
- `src/tests/fixtures/`: Shared custom fixtures.
- `src/pages/`: Page-level actions and workflows.
- `src/pageObjects/`: Locator definitions and element getters.
- `src/interfaces/`: Type contracts for pages and AI services.
- `src/models/`: Shared data models and endpoint contracts.
- `src/containers/`: Inversify dependency-injection bindings and symbols.
- `src/services/`: Service implementations (for example, AI locator healing).
- `src/utils/`: Generic helpers (DOM collection, utility functions).
- `src/resource/`: Static test data and API payload files.

## Flow

1. A spec imports `test` from `fixtures`.
2. Fixtures configure auth/session hooks and self-healing behavior.
3. Specs call page actions from `src/pages`.
4. Page classes use locators from `src/pageObjects`.
5. Containers resolve service/page dependencies.
6. On locator failures, AI service (`LocatorHealer`) runs retrieval + suggestion.

## Import Convention

Use path aliases (`@containers/*`, `@pages/*`, `@interfaces/*`, `@utils/*`) or relative imports.

Do not import using `src/...` absolute paths.
This is enforced by ESLint (`no-restricted-imports`).
