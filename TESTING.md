# Testing Guide

## Overview

This document describes the comprehensive test suite for the Users page with audit log functionality.

## Test Structure

```
/tests/
├── unit/
│   ├── models/                 # Database model tests
│   │   └── AuditLog.model.test.ts
│   ├── services/               # Service layer tests
│   │   └── AuditLog.service.test.ts
│   ├── components/             # Component tests
│   │   └── AuditLog.components.test.tsx
│   └── utils.test.ts          # Utility and helper tests
├── integration/
│   ├── api/                    # API route tests
│   │   └── audit-logs/
│   │       ├── route.test.ts           # Main audit logs route
│   │       ├── stats/
│   │       │   └── route.test.ts       # Stats endpoint
│   │       └── user/
│   │           └── [userId]/
│   │               └── route.test.ts   # User-specific logs
│   ├── pages/                  # Page component tests
│   │   └── users-page.test.tsx
│   ├── e2e/                    # End-to-end integration tests
│   │   └── audit-logs.e2e.test.ts
│   └── index.test.ts          # API integration tests
└── setup.ts                    # Test configuration and mocks
```

## Test Coverage Areas

### 1. AuditLog Model Tests (`tests/unit/models/`)

- **Create**: Test audit log creation
  - Basic creation without details
  - Creation with additional details (JSON)
  
- **Filtering**: Test query filtering
  - Filter by action type
  - Filter by entity type
  - Filter by user ID
  - Multiple filter combinations
  
- **Querying**: Test data retrieval
  - Pagination support (take/skip)
  - Sorting by date
  - Including user relations
  - Count operations
  
- **All allowed values**: Test enums
  - AuditAction: CREATE, UPDATE, DELETE, APPROVE, REJECT, COMMENT, LIKE
  - AuditEntityType: VIDEO, COMMENT, CATEGORY, PARTICIPANT, IMAGE

**Run**: `npm test unit/models`

### 2. AuditLog Service Tests (`tests/unit/services/`)

- **getAuditLogs**: Fetch paginated audit logs
  - Pagination with page/pageSize
  - Filtering by action
  - Filtering by entity type
  - Sorting support

- **getUserAuditLogs**: Fetch user-specific logs
  - User's own logs
  - Admin fetching other users' logs
  
- **getAuditLogStats**: Calculate statistics
  - Total count
  - Breakdown by action
  - Breakdown by entity type
  - Date-based aggregation

- **createAuditLog**: Create new log entry
  - With details
  - Without details

- **getAuditLogById**: Fetch single log by ID

**Run**: `npm test unit/services`

### 3. Component Tests (`tests/unit/components/`)

- **AuditLogTable**: Display audit logs in table format
  - Render logs with all columns
  - Display user information
  - Empty state handling
  - Date formatting

- **AuditLogStats**: Display statistics
  - Total count display
  - Action breakdown
  - Entity type breakdown
  - Zero counts handling

- **AuditLogFilters**: Filter controls
  - Render filter inputs
  - Action filtering
  - Entity type filtering
  - Clear all filters

**Run**: `npm test unit/components`

### 4. Page Tests (`tests/integration/pages/`)

- **Users Page**: Main users list
  - Admin access control
  - Audit logs display
  - Pagination controls
  - Loading/error states

- **User Detail Page**: Individual user view
  - User information display
  - User's audit logs
  - Date range filtering
  - Navigation to log details

**Run**: `npm test integration/pages`

### 5. API Route Tests (`tests/integration/api/`)

- **GET /api/audit-logs**: Fetch all audit logs
  - Authentication checks (401/403)
  - Pagination parameters
  - Filtering by action
  - Filtering by entity type
  - User relation inclusion

- **GET /api/audit-logs/stats**: Fetch statistics
  - Admin-only endpoint (403 for non-admin)
  - Total count
  - Action breakdown
  - Entity type breakdown

- **GET /api/audit-logs/user/[userId]**: User-specific logs
  - Own logs access
  - Admin access to other users
  - Non-admin restriction (403)
  - Handle non-existent user

**Run**: `npm test integration/api`

### 6. End-to-End Integration Tests (`tests/integration/e2e/`)

- **Admin User Flow**
  - Navigate to users page
  - Apply filters and view results
  - Navigate through pagination
  - Sort logs by date
  - View statistics

- **Non-Admin User Flow**
  - Access restrictions
  - View own logs only
  - No access to other users' logs

- **Auth Context Tests**
  - Initialize auth state
  - Admin authentication
  - Regular user authentication

- **API Integration Tests**
  - Fetch logs from API
  - Fetch statistics
  - Fetch user logs

- **Component Integration Tests**
  - Table with filters
  - Stats with charts
  - Filter state updates

- **Error Handling**
  - API error handling
  - Invalid user ID
  - Empty response handling

- **Performance Tests**
  - Load time within acceptable bounds
  - Handle large datasets (1000+ items)

**Run**: `npm test integration/e2e`

## Test Configuration

### vitest.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["./tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

### setup.ts

- Mocks for Next.js hooks (useRouter, useSearchParams, etc.)
- Mock auth context
- Mock Prisma client
- Global cleanup after each test

## Running Tests

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Files

```bash
# Unit tests only
npm test unit/models/AuditLog.model.test.ts

# Component tests
npm test unit/components/AuditLog.components.test.tsx

# Page tests
npm test integration/pages/users-page.test.tsx

# API tests
npm test integration/api/

# E2E tests
npm test integration/e2e/audit-logs.e2e.test.ts
```

### Run with Coverage

```bash
npm test -- --coverage
```

### Watch Mode

```bash
npm test -- --watch
```

## Mocking Strategy

### Prisma Client

```typescript
vi.mock("@/lib/prisma", () => ({
  default: {
    auditLog: {
      findMany: vi.fn(),
      create: vi.fn(),
      // ... other methods
    },
  },
}));
```

### Auth Context

```typescript
vi.mock("auth", () => ({
  auth: (callback: any) => {
    return async (req: Request) => {
      const session = { user: { id: "test-user", role: "user" } };
      return callback({ req, auth: session });
    };
  },
}));
```

### Next.js Hooks

```typescript
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({
    get: vi.fn((key) => {
      const params: Record<string, string> = { page: "1", pageSize: "10" };
      return params[key];
    }),
  }),
}));
```

## Test Data Models

### AuditLog Entity

```typescript
{
  id: string;
  action: AuditAction; // CREATE, UPDATE, DELETE, APPROVE, REJECT, COMMENT, LIKE
  entityType: AuditEntityType; // VIDEO, COMMENT, CATEGORY, PARTICIPANT, IMAGE
  entityId: string;
  userId: string;
  details?: Json;
  createdAt: DateTime;
  user: User;
}
```

### AuditLogStats

```typescript
{
  total: number;
  byAction: Record<AuditAction, number>;
  byEntityType: Record<AuditEntityType, number>;
}
```

## API Endpoints Tested

### GET /api/audit-logs

**Admin Access Required**

Query Parameters:
- `page` (default: 1)
- `pageSize` (default: 10)
- `action` (optional filter)
- `entityType` (optional filter)

Response:
```json
{
  "data": AuditLog[],
  "meta": {
    "page": number,
    "pageSize": number,
    "total": number,
    "totalPages": number
  }
}
```

### GET /api/audit-logs/stats

**Admin Access Required**

Response:
```json
{
  "data": {
    "total": number,
    "byAction": { "CREATE": 10, ... },
    "byEntityType": { "VIDEO": 15, ... }
  }
}
```

### GET /api/audit-logs/user/[userId]

**Admin Access OR Own Logs**

Query Parameters:
- `page` (default: 1)
- `pageSize` (default: 10)

Response:
```json
{
  "data": AuditLog[],
  "meta": { ... }
}
```

## Best Practices

1. **Always mock external dependencies** (Prisma, auth, Next.js hooks)
2. **Test both positive and negative cases**
3. **Use descriptive test names** explaining the scenario
4. **Clean up mocks between tests** using `beforeEach`
5. **Test edge cases** (empty data, invalid IDs, etc.)
6. **Verify pagination logic** for list endpoints
7. **Test authentication/authorization** on protected routes
8. **Use snapshot testing** for complex components

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Ensure all dependencies are installed
   - Check import paths match test structure

2. **Auth errors in tests**
   - Mock auth context properly
   - Verify session object structure

3. **Prisma errors**
   - Mock all Prisma client methods used in component
   - Return appropriate mock data

## Summary

- **Total Test Files**: 12+
- **Test Coverage**: Model, Service, Component, Page, API, E2E
- **Authentication Testing**: Admin/Non-admin scenarios
- **Pagination Testing**: Page navigation andoffset calculation
- **Filtering Testing**: Action, entity type, date range filters
- **Sorting Testing**: Date-based sorting
