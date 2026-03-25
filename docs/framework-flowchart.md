# Framework Flowchart

This page provides a standalone, shareable view of the framework execution flow.

## End-to-End Flow

```mermaid
flowchart TD
    A[Run npm test / playwright test] --> B[Load playwright.config.ts]
    B --> C[Initialize project: chromium]
    C --> D[Discover tests in src/tests]

    D --> E{Spec imports which fixture?}
    E -->|base.fixture| F[Create Playwright test context]
    E -->|auth.fixture| G[Create base fixture then extend with auth helpers]

    F --> H[beforeEach in spec resolves page classes from container]
    G --> H

    H --> I[Execute test steps]
    I --> J[Page class methods run]
    J --> K[PageObject locators interact with DOM]
    K --> L[Assertions execute]

    L --> M{Failed?}
    M -->|No| N[Store results: HTML + Allure]
    M -->|Yes| O[base.fixture auto hook: selfHealOnFailure]
    O --> P[Read error from testInfo.errors]
    P --> Q[Extract failed locator pattern]
    Q --> R[Collect DOM using getDOM(page)]
    R --> S[LocatorHealer.suggestLocator(dom, failedLocator)]
    S --> T[Index/chunk DOM and retrieve relevant chunks]
    T --> U[OpenAI completion returns suggested locator]
    U --> V[Log failed and suggested locator]
    V --> N
```

## Source File

- Mermaid source: [docs/framework-flowchart.mmd](docs/framework-flowchart.mmd)
