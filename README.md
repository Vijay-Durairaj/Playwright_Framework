# Playwright Automation Framework

A comprehensive test automation framework built with **Playwright**, **TypeScript**, **Inversify** (Dependency Injection), and **Allure Reporting**. This framework follows best practices for scalable and maintainable test automation.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Setup & Installation](#setup--installation)
- [Running Tests](#running-tests)
- [Test Data Management](#test-data-management)
- [Project Flow](#project-flow)
- [Key Components](#key-components)
- [Best Practices](#best-practices)

---

## 🛠️ Tech Stack

- **Playwright** (`^1.58.2`) - Modern cross-browser test automation
- **TypeScript** (`^5.4.0`) - Type-safe automation code
- **Inversify** (`^6.0.2`) - Lightweight Dependency Injection container
- **Allure** (`^3.5.0`) - Advanced test reporting and analytics
- **Node.js** - JavaScript runtime

### DevDependencies
```json
{
  "@playwright/test": "^1.58.2",
  "@types/node": "^25.3.0",
  "allure": "^3.2.0",
  "allure-playwright": "^3.5.0",
  "typescript": "^5.4.0"
}
```

---

## 📁 Project Structure

```
Playwright_Framework/
├── src/
│   ├── config/
│   │   └── playwright.config.ts          # Playwright configuration
│   ├── containers/
│   │   └── loginpage/
│   │       ├── LoginPage.inversify.ts    # DI container setup
│   │       └── LoginPage.symbol.ts       # Symbol definitions
│   ├── helper/
│   │   └── DataHelper.ts                 # Test data loading utility
│   ├── interfaces/
│   │   ├── LoginPage.ts                  # LoginPage interface
│   │   └── HomePage.ts                   # HomePage interface
│   ├── pageObjects/
│   │   ├── LoginPageObj.ts               # Login page selectors & methods
│   │   └── HomePageObj.ts                # Home page selectors & methods
│   ├── pages/
│   │   ├── LoginPage.ts                  # Login page class (injectable)
│   │   └── HomePage.ts                   # Home page class (injectable)
│   ├── resource/
│   │   └── testdata/
│   │       └── testdata.json             # Test data (credentials, URLs)
│   ├── tests/
│   │   ├── loginpage.spec.ts             # Login test suite
│   │   └── launchBrowser.spec.ts         # Browser launch tests
│   └── utils/
│       └── TestDataTypes.ts              # TypeScript interfaces for test data
├── allure-results/                       # Allure test results (generated)
├── allure-report/                        # Allure HTML report (generated)
├── playwright-report/                    # Playwright HTML report (generated)
├── playwright.config.ts                  # Playwright configuration
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Dependencies & scripts
└── README.md                             # This file
```

---

## 🏗️ Architecture & Design Patterns

### 1. **Page Object Model (POM)**
- **PageObject Classes** (`src/pages/`): High-level business logic for interacting with pages
- **PageObject Selectors** (`src/pageObjects/`): Low-level DOM selectors and locators
- **Separation of Concerns**: Tests interact with pages, not directly with DOM

**Example Flow:**
```
Test → LoginPage (injectable) → LoginPageObj (selectors) → Playwright Locators
```

### 2. **Dependency Injection (DI) with Inversify**
- **Symbols** (`src/containers/*/LoginPage.symbol.ts`): Define injectable identifiers
- **Container** (`src/containers/*/LoginPage.inversify.ts`): Register and resolve dependencies
- **@injectable() Decorator**: Mark classes as injectable

**Benefits:**
- Loose coupling between components
- Easy to mock and test
- Centralized dependency management

### 3. **Type Safety with TypeScript Interfaces**
- **Interfaces** (`src/interfaces/`): Define contracts for page classes
- **Data Types** (`src/utils/TestDataTypes.ts`): Strongly-typed test data structures

### 4. **Data-Driven Testing**
- **DataHelper** (`src/helper/DataHelper.ts`): Loads and manages test data from JSON
- **Test Data** (`src/resource/testdata/testdata.json`): Centralized test data repository
- **Type-Safe Data Access**: Generic methods with TypeScript types

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/vijay/Playwright_Framework.git
   cd Playwright_Framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Verify setup**
   ```bash
   npm test
   ```

---

## ▶️ Running Tests

### NPM Scripts

#### Run all tests with Allure report
```bash
npm test
```

#### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

#### Debug tests (step through code)
```bash
npm run test:debug
```
or
```bash
npm run debug
```

#### Generate Allure report
```bash
npm run allure:report
```

#### Open Allure report in browser
```bash
npm run allure:open
```

#### Run tests and open Allure report
```bash
npm run test:allure
```

---

## 📊 Test Data Management

### Test Data Structure (`testdata.json`)

```json
{
  "urls": {
    "login": "https://rahulshettyacademy.com/client"
  },
  "loginData": [
    {
      "testId": "valid-user",
      "description": "Login with valid credentials",
      "email": "validvijaydurairaj@mail.com",
      "password": "P@ssword@1",
      "expectedResult": "success"
    }
  ]
}
```

### DataHelper API

The `DataHelper` class provides type-safe access to test data:

```typescript
// Load entire data object
const data = DataHelper.load<TestData>('testdata.json');

// Get a specific field (e.g., URLs)
const urls = DataHelper.getField<TestData, TestData['urls']>('testdata.json', 'urls');

// Get all items from an array
const loginRows = DataHelper.getAll<TestData, LoginTestData>('testdata.json', 'loginData');

// Find specific item by key/value
const user = DataHelper.getById<TestData, LoginTestData>(
  'testdata.json',
  'loginData',
  'email',
  'test@example.com'
);

// Filter items by criteria
const successTests = DataHelper.getWhere<TestData, LoginTestData>(
  'testdata.json',
  'loginData',
  'expectedResult',
  'success'
);

// Clear cache
DataHelper.clearCache('testdata.json');
```

---

## 🔄 Project Flow

### 1. **Test Execution Flow**

```
npm test
    ↓
Playwright Config Loaded
    ↓
Test Files Discovered (src/tests/*.spec.ts)
    ↓
Test Hooks (beforeEach, afterEach)
    ↓
Test Cases Execute
    ↓
Allure Results Generated
    ↓
Allure Report Generated
```

### 2. **Login Test Flow (Example)**

```
loginpage.spec.ts
    ↓
Load Test Data (DataHelper.getAll)
    ↓
beforeEach Hook
    ├─ Create Inversify Container
    ├─ Get LoginPage instance from container
    └─ Initialize LoginPage with browser page
    ↓
Test Case Executes
    ├─ Navigate to login URL
    ├─ Verify form is visible
    ├─ Call loginPage.login(email, password)
    │   └─ LoginPage uses LoginPageObj selectors
    │       ├─ Fill email field
    │       ├─ Fill password field
    │       └─ Click submit button
    ├─ Wait for network idle
    └─ Verify login success
    ↓
Results Reported to Allure
```

### 3. **Dependency Injection Container Setup**

```
LoginPage.inversify.ts
    ↓
Create Inversify Container
    ↓
Register ILoginPage → LoginPage binding
    ↓
Test Retrieves Instance
    ↓
container.get<LoginPage>(LOGIN_PAGE.LoginPage)
    ↓
Fully Initialized LoginPage Instance
```

---

## 🔧 Key Components

### Page Classes (`src/pages/`)

**LoginPage.ts:**
```typescript
@injectable()
export class LoginPage implements ILoginPage {
    private page!: Page;
    private loginPageObj!: LoginPageObj;

    init(page: Page): this { /* ... */ }
    async login(username: string, password: string): Promise<void> { /* ... */ }
    async isLoginSuccessful(): Promise<boolean> { /* ... */ }
}
```

- Decorated with `@injectable()` for Inversify
- Implements `ILoginPage` interface
- Contains business logic for page interactions
- Uses `LoginPageObj` for selectors

### Page Objects (`src/pageObjects/`)

**LoginPageObj.ts:**
```typescript
export class LoginPageObj {
    getUsernameField(): Locator { /* ... */ }
    getPasswordField(): Locator { /* ... */ }
    getSubmitButton(): Locator { /* ... */ }
    getHomePageIndicator(): Locator { /* ... */ }
}
```

- Contains only selectors and locators
- No business logic
- Used by page classes

### Test Data Types (`src/utils/TestDataTypes.ts`)

```typescript
export interface LoginTestData {
    testId: string;
    description: string;
    email: string;
    password: string;
    expectedResult: 'success' | 'failure';
}

export interface TestData {
    loginData: LoginTestData[];
    urls: { login: string; dashboard: string };
}
```

- Define structure of test data
- Enable type-safe access to data
- Support IDE autocomplete

### Interfaces (`src/interfaces/`)

**LoginPage.ts:**
```typescript
export interface ILoginPage {
    login(username: string, password: string): void;
}
```

- Define contracts for page classes
- Support dependency injection
- Enable loose coupling

### DI Container (`src/containers/loginpage/`)

**LoginPage.inversify.ts:**
```typescript
export const container = new Container();
container.bind<ILoginPage>(LOGIN_PAGE.LoginPage).to(LoginPage);
```

**LoginPage.symbol.ts:**
```typescript
export const LOGIN_PAGE = {
    LoginPage: Symbol('LoginPage')
};
```

---

## 🎯 Best Practices

### 1. **Test Organization**
- ✅ One test file per page/feature
- ✅ Use `test.describe()` to group related tests
- ✅ Use `test.beforeEach()` for common setup
- ✅ Use `test.afterEach()` for cleanup

### 2. **Page Object Model**
- ✅ Keep selectors in `PageObj` classes
- ✅ Put business logic in `Page` classes
- ✅ Use descriptive method names (`getUsernameField()` not `getElement()`)
- ✅ Return `Locator` objects from selector methods

### 3. **Test Data**
- ✅ Centralize test data in JSON files
- ✅ Use TypeScript interfaces for type safety
- ✅ Use `DataHelper` for data access
- ✅ Avoid hardcoding credentials in tests

### 4. **Dependency Injection**
- ✅ Use Inversify containers for dependency management
- ✅ Inject dependencies via constructor
- ✅ Use symbols for injectable identifiers
- ✅ Keep containers organized by feature

### 5. **Code Quality**
- ✅ Use TypeScript strict mode
- ✅ Use meaningful variable names
- ✅ Add comments for complex logic
- ✅ Keep methods focused and small

### 6. **Test Execution**
- ✅ Run tests in headless mode in CI/CD
- ✅ Use `test.describe()` for organization
- ✅ Use proper wait strategies (networkidle, navigation)
- ✅ Capture screenshots/videos on failure

### 7. **Reporting**
- ✅ Use Allure for advanced reporting
- ✅ Add test descriptions and steps
- ✅ Attach screenshots/videos on failure
- ✅ Review reports regularly

---

## 📈 Playwright Configuration

The project uses the following Playwright settings (`playwright.config.ts`):

```typescript
{
  testDir: './src/tests',           // Where test files are located
  fullyParallel: false,              // Run tests sequentially
  workers: 1,                        // Single worker process
  retries: 0,                        // No retries locally
  headless: false,                   // Show browser during tests
  trace: 'retain-on-failure',       // Capture trace on failure
  reporters: ['html', 'allure-playwright']  // Generate reports
}
```

---

## 🐛 Troubleshooting

### Tests not finding test data
```bash
# Check DataHelper logs
npm run test:debug
# Verify testdata.json path
# Check src/resource/testdata/ directory
```

### DI Container errors
```bash
# Ensure all classes are decorated with @injectable()
# Check symbol is properly exported
# Verify Container binding is correct
```

### Playwright browser not found
```bash
# Reinstall Playwright browsers
npx playwright install
```

### Allure report not generating
```bash
# Install Allure command-line
npm install -g allure
# Check allure-results directory exists
# Run allure:report script
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Inversify Documentation](https://inversify.io/)
- [Allure Documentation](https://docs.qameta.io/allure/)

---

## 📝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your changes'`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request

---

## 📄 License

ISC

---

## ✉️ Contact

For questions or issues, please reach out to the automation team.

---

**Last Updated:** March 1, 2026
