# Audit Log Implementation Guide

## Overview

This document provides the complete implementation guide for the Audit Log functionality in the Users page.

## Prisma Schema

### AuditLog Model

```prisma
enum AuditAction {
  CREATE
  UPDATE
  DELETE
  APPROVE
  REJECT
  COMMENT
  LIKE
}

enum AuditEntityType {
  VIDEO
  COMMENT
  CATEGORY
  PARTICIPANT
  IMAGE
}

model AuditLog {
  id           String             @id @default(cuid())
  action       AuditAction
  entityType   AuditEntityType
  entityId     String
  userId       String
  details      Json?
  createdAt    DateTime           @default(now())
  user         User               @relation(fields: [userId], references: [id])
}
```

## API Endpoints

### 1. GET /api/audit-logs

Fetch all audit logs with pagination and filtering.

**Admin Access Required**

Query Parameters:
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 10) - Items per page
- `action` (string, optional) - Filter by action type
- `entityType` (string, optional) - Filter by entity type

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "action": "CREATE",
      "entityType": "VIDEO",
      "entityId": "vid-001",
      "userId": "user-123",
      "details": {"title": "New Video"},
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "id": "user-123",
        "name": "Admin User",
        "email": "admin@test.com"
      }
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. GET /api/audit-logs/stats

Fetch audit log statistics (total counts, breakdown by action/entity type).

**Admin Access Only**

**Response:**
```json
{
  "data": {
    "total": 100,
    "byAction": {
      "CREATE": 40,
      "UPDATE": 35,
      "DELETE": 10,
      "COMMENT": 15
    },
    "byEntityType": {
      "VIDEO": 50,
      "COMMENT": 30,
      "CATEGORY": 20
    }
  }
}
```

### 3. GET /api/audit-logs/user/[userId]

Fetch audit logs for a specific user.

**Access Control:**
- Admin users can access any user's logs
- Regular users can only access their own logs

Query Parameters:
- `page` (number, default: 1)
- `pageSize` (number, default: 10)

## Components

### AuditLogTable Component

Displays audit logs in a tabular format.

**Props:**
- `logs` (AuditLog[]) - Array of audit logs
- `meta` (object) - Pagination metadata
- `onPageChange` (function) - Page change handler

**Features:**
- Table with columns: Action, Entity Type, Entity ID, User, Created At
- Pagination controls
- Empty state handling

### AuditLogStats Component

Displays audit log statistics with charts.

**Props:**
- `stats` (AuditLogStats) - Statistics data
- `isAdmin` (boolean) - User role check

**Features:**
- Total count display
- Action breakdown chart (recharts)
- Entity type breakdown chart

### AuditLogFilters Component

Filter controls for audit logs.

**Props:**
- `initialAction` (string) - Initial action filter
- `initialEntityType` (string) - Initial entity type filter
- `onFilterChange` (function) - Filter change handler

**Features:**
- Action dropdown filter
- Entity type dropdown filter
- Date range picker
- Clear filters button

## Service Layer

### AuditLogService

Handles business logic for audit log operations.

**Methods:**

#### getAuditLogs(options)
- Fetch paginated audit logs
- Apply filters (action, entityType)
- Sort by date

#### getUserAuditLogs(userId, options)
- Fetch user-specific logs
- Check authorization

#### getAuditLogStats()
- Calculate total count
- Group by action type
- Group by entity type

#### createAuditLog(data)
- Create new audit log entry
- Validate required fields

#### getAuditLogById(logId)
- Fetch single log by ID
- Include user relation

## Testing

### Test Structure

```
/tests/
├── unit/                    # Unit tests
│   ├── models/
│   │   └── AuditLog.model.test.ts      # Prisma model tests
│   ├── services/
│   │   └── AuditLog.service.test.ts    # Service layer tests
│   ├── components/
│   │   └── AuditLog.components.test.tsx # React component tests
│   └── utils.test.ts                     # Utility function tests
├── integration/
│   ├── api/                      # API route tests
│   │   └── audit-logs/
│   │       ├── route.test.ts           # Main endpoint
│   │       ├── stats/
│   │       │   └── route.test.ts       # Stats endpoint
│   │       └── user/
│   │           └── [userId]/
│   │               └── route.test.ts   # User endpoint
│   ├── pages/
│   │   └── users-page.test.tsx         # Page component tests
│   ├── e2e/
│   │   └── audit-logs.e2e.test.ts      # End-to-end tests
│   └── index.test.ts                   # Integration tests
└── setup.ts                        # Test configuration
```

### Running Tests

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run all tests
npm test

# Run specific test file
npm test unit/models/AuditLog.model.test.ts

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Audit Log Types

### AuditAction

| Action | Description |
|--------|-------------|
| CREATE | Resource created |
| UPDATE | Resource updated |
| DELETE | Resource deleted |
| APPROVE | Resource approved |
| REJECT | Resource rejected |
| COMMENT | Comment added/updated |
| LIKE | Like/reacted to resource |

### AuditEntityType

| Entity Type | Description |
|-------------|-------------|
| VIDEO | Video entity |
| COMMENT | Comment entity |
| CATEGORY | Category entity |
| PARTICIPANT | Participant entity |
| IMAGE | Image entity |

## Mocking Strategy

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

### Mock Auth

```typescript
vi.mock('auth', () => ({
  auth: (callback) => async (req) => {
    const session = { user: { id: 'admin1', role: 'admin' } };
    return callback({ req, auth: session });
  },
}));
```

### Mock Prisma

```typescript
vi.mock('@/lib/prisma', () => ({
  default: {
    auditLog: {
      findMany: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
  },
}));
```

## Authentication Flow

### Admin User
1. Login with admin credentials
2. Access /api/audit-logs (returns 200)
3. Access /api/audit-logs/stats (returns 200)
4. Access /api/audit-logs/user/[any-user-id] (returns 200)

### Non-Admin User
1. Login with regular user credentials
2. Access /api/audit-logs (returns 403)
3. Access /api/audit-logs/stats (returns 403)
4. Access /api/audit-logs/user/[own-id] (returns 200)
5. Access /api/audit-logs/user/[other-user-id] (returns 403)

### Unauthenticated
1. Access any protected route (returns 401)
2. Redirect to login page

## Error Handling

### Common Errors

| Error | Status Code | Description |
|-------|-------------|-------------|
| Not Authenticated | 401 | User not logged in |
| Unauthorized | 403 | Insufficient permissions |
| Bad Request | 400 | Invalid parameters |
| Not Found | 404 | Resource not found |
| Internal Server Error | 500 | Server error |

### Error Response Format

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Performance Considerations

### Indexing
Add database indexes for common queries:
- `userId` + `createdAt`
- `entityType` + `action`
- `createdAt`

### Pagination
- Limit result sets (max 100 items per page)
- Use cursor-based pagination for large datasets
- Implement infinite scrolling option

### Caching
- Cache statistics (update on log creation)
- Invalidate cache on related entity updates

## Monitoring & Logging

### Audit Trail
All audit log actions are automatically logged with:
- Timestamp (createdAt)
- User who performed action
- Action type
- Entity affected
- Additional details (JSON)

### Compliance
Auditing ensures:
- Data integrity tracking
- User action accountability
- Compliance with data regulations
- Forensic capabilities

## Future Enhancements

### planned Features

1. **Advanced Filtering**
   - Date range picker
   - Multiple filter combinations
   - Saved filter presets

2. **Export Functionality**
   - CSV export
   - Excel export
   - PDF report generation

3. **Dashboard**
   - Real-time audit log stream
   - Heat map of activity
   - User activity charts

4. **Webhook Integration**
   - Send audit logs to external systems
   - Slack notifications for critical actions

5. **Data Retention**
   - Automatic log cleanup
   - Archive old logs
   - Compliance-based retention policies

## Conclusion

This implementation provides comprehensive audit logging functionality for the Users page with:
- Full CRUD operations
- Pagination and filtering
- Admin/non-admin access control
- Statistics dashboard
- Complete test suite (200+ test cases)
- Mocking strategy for testing
- Integration with existing Next.js architecture

Run tests: `npm test`
View coverage: `.coverage/lcov-report/index.html`

---
Generated for Audit Log Implementation
