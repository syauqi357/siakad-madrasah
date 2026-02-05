# API Reference

Base URL: `/routes/api`

> Full API documentation: See `API_DOCUMENTATION.md` in project root

## Quick Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| POST | `/auth/change-password` | Change password |
| GET | `/auth/profileUsers` | Get current user |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/studentDataSet` | List all |
| GET | `/studentDataSet/:id` | Get one |
| POST | `/students` | Create |
| PUT | `/students/:id` | Update |
| DELETE | `/students/:id` | Delete |
| POST | `/students/upload-bulk` | Excel import |

### Scores
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/score/scorebyclass` | Get class scores |
| POST | `/score/scores` | Save scores (upsert) |
| POST | `/score/upload` | Excel import |
| GET | `/score/template/:rombelId` | Download template |

### Assessment Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assessment-types` | List all |
| POST | `/assessment-types` | Create |
| PUT | `/assessment-types/:id` | Update |
| PATCH | `/assessment-types/:id/toggle` | Toggle active |
| DELETE | `/assessment-types/:id` | Delete |

### Rombel (Class Groups)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rombel` | List all |
| GET | `/rombel/:id` | Get details |
| POST | `/rombel` | Create |

### Grade Promotion
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/promotion/students/:rombelId` | Get students |
| POST | `/promotion/promote` | Promote students |

### Graduates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/graduates` | List alumni |
| POST | `/graduates/:id` | Graduate student |
| POST | `/graduates/bulk` | Bulk graduate |

## Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Authentication

Most endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

Token expires in 24 hours.
