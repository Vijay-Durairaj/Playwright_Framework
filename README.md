# Playwright Automation Framework

Scalable test automation framework built with Playwright + TypeScript, using Inversify for dependency injection, fixture layering for reusable test setup, and AI-assisted self-healing for locator failures.

## Highlights

- Layered framework: `tests` -> `pages` -> `pageObjects`.
- Reusable custom fixtures (`base` and `auth`).
- Inversify DI for page/service wiring.
- Data-driven tests from JSON files.
- API interception support for validating backend responses.
- RAG-style AI locator suggestion on failed tests.
- HTML and Allure reports.
- ESLint rule enforcing consistent imports (no `src/...` absolute imports).

## Tech Stack

- Playwright
- TypeScript
- Inversify
- OpenAI SDK
- LangChain and ChromaDB (available for RAG evolution)
- Allure reporter
- ESLint

## Project Structure

```text
Playwright_Framework/
├── src/
│   ├── containers/              # DI containers and symbols
│   │   ├── ai/
│   │   ├── homepage/
│   │   ├── loginpage/
│   │   └── productlistingpage/
│   ├── interfaces/              # Contracts for pages/services
│   │   ├── ai/
│   │   └── pages/
│   ├── models/                  # Shared data models
│   ├── pageObjects/             # Locator-only classes
│   ├── pages/                   # Business/page actions
│   ├── resource/                # Test data and API test data
│   │   ├── testdata/
│   │   └── api_testdata/
│   ├── services/                # Concrete service implementations
│   ├── tests/
│   │   ├── fixtures/            # Shared fixture layers
│   │   │   ├── base.fixture.ts
│   │   │   └── auth.fixture.ts
│   │   ├── launchBrowser.spec.ts
│   │   ├── loginpage.spec.ts
│   │   └── productlistingpage.spec.ts
│   └── utils/
├── ARCHITECTURE.md
├── playwright.config.ts
├── tsconfig.json
├── eslint.config.cjs
├── package.json
└── README.md
```

## Framework Layers

### 1. Test Layer (`src/tests`)

- Contains spec files with assertions and test intent.
- Specs import `test` from fixtures, not directly from Playwright.

### 2. Fixture Layer (`src/tests/fixtures`)

- `base.fixture.ts`:
  - Extends Playwright test.
  - Adds auto self-healing behavior on test failures.
  - Extracts failed locator from error logs.
- `auth.fixture.ts`:
  - Extends `base.fixture.ts`.
  - Adds `loginAs()` and `getToken()` helpers.

### 3. Page Layer (`src/pages`)

- Holds user/business actions.
- Uses page objects internally.

### 4. Page Object Layer (`src/pageObjects`)

- Centralizes selectors and locator builders.
- Keeps selector maintenance isolated from test flow logic.

### 5. DI Layer (`src/containers`)

- Inversify containers bind interfaces/symbols to implementations.
- Provides test-friendly construction patterns, including page factories.

### 6. Service Layer (`src/services`)

- `LocatorHealer` implements AI-assisted locator suggestion.
- Uses retrieval + generation approach for failure analysis.

## End-to-End Framework Flow

```mermaid
flowchart TD
    A[npm test] --> B[Playwright loads config]
    B --> C[Discover specs in src/tests]
    C --> D[Spec imports fixture test object]
    D --> E[Fixture setup runs]
    E --> F[Resolve pages/services from DI containers]
    F --> G[Execute page actions]
    G --> H[Run assertions]
    H --> I{Test failed?}
    I -- No --> J[Write HTML and Allure results]
    I -- Yes --> K[Base fixture self-heal hook]
    K --> L[Capture DOM + extract failed locator]
    L --> M[LocatorHealer suggests better locator]
    M --> J
```

## Self-Healing (RAG-Style) Flow

```mermaid
flowchart TD
    A[Test failure] --> B[Get error message from testInfo]
    B --> C[Parse failed locator pattern]
    C --> D[Capture page DOM]
    D --> E[Chunk DOM]
    E --> F[Generate embeddings for chunks]
    F --> G[Embed failed locator query]
    G --> H[Cosine similarity retrieval top-k chunks]
    H --> I[Build prompt with retrieved context]
    I --> J[OpenAI completion returns locator]
    J --> K[Log suggested locator for debugging/fix]
```

## Onboarding Flow (Login + Product Listing)

```mermaid
flowchart LR
    subgraph LoginSuite[Login Suite Path]
        L1[loginpage.spec.ts starts] --> L2[beforeEach resolves LoginPage via DI]
        L2 --> L3[Navigate to login URL from test data]
        L3 --> L4[Perform login action]
        L4 --> L5[Assert login success and logout]
    end

    subgraph ProductSuite[Product Listing Suite Path]
        P1[productlistingpage.spec.ts starts] --> P2[Register product API route]
        P2 --> P3[Set waitForResponse predicate]
        P3 --> P4[Use auth fixture loginAs]
        P4 --> P5[Capture API JSON from intercepted response]
        P5 --> P6[Assert products list length > 0]
    end

    L5 --> X[Playwright report + Allure result]
    P6 --> X
```

## API Interception Pattern

Used in product listing tests:

- Register route before triggering action.
- Capture response body from route fetch.
- Wait for matching response with `page.waitForResponse`.
- Assert on parsed response (`data` list, count, fields).

This pattern avoids race conditions and ensures deterministic API assertions.

## Configuration

### Playwright

- Test directory: `./src/tests`
- Browser project: Chromium
- Workers: `1`
- Parallel mode: disabled
- Trace: `retain-on-failure`
- Reporters: HTML and Allure

### TypeScript Aliases

- `@containers/*` -> `src/containers/*`
- `@pages/*` -> `src/pages/*`
- `@pageObjects/*` -> `src/pageObjects/*`
- `@interfaces/*` -> `src/interfaces/*`
- `@services/*` -> `src/services/*`
- `@utils/*` -> `src/utils/*`

### Lint Rule For Import Consistency

ESLint blocks `src/...` absolute imports via `no-restricted-imports`.

Use either:

- Alias imports (`@containers/...`, `@pages/...`) or
- Relative imports (`../...`)

## Setup

Prerequisites:

- Node.js 18+
- npm

Install:

```bash
npm install
npx playwright install
```

## Run Commands

- `npm test`: Run tests and generate Allure report.
- `npm run test:headed`: Run headed tests and generate Allure report.
- `npm run debug` or `npm run test:debug`: Run in debug mode.
- `npm run lint`: Run ESLint checks.
- `npm run lint:fix`: Auto-fix lint issues where possible.
- `npm run allure:report`: Generate Allure report from results.
- `npm run allure:open`: Open generated Allure report.
- `npm run test:allure`: Run tests, generate report, and open report.

## Environment Variables

Create `.env` at repo root with:

```env
OPENAI_API_KEY=your_openai_api_key
```

Use plain `KEY=value` format for `.env` files.

## Additional Documentation

- `ARCHITECTURE.md` contains concise architecture responsibilities and conventions.

## References

- https://playwright.dev/
- https://www.typescriptlang.org/docs/
- https://inversify.io/
- https://allurereport.org/
