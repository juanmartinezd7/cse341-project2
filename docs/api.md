# Bookstore API

Base URL (local): `http://localhost:4000`

## Authentication (OAuth)

### `GET /auth/google`
Starts Google OAuth login flow.

### `GET /auth/google/callback`
Callback URL for Google OAuth. On success returns logged in user JSON.

### `GET /auth/me`
Returns the currently logged-in user.

### `GET /auth/logout`
Logs out the current session.

---

## Books

Base path: `/api/books`

### GET `/api/books`
Returns all books.

**Response 200:**
```json
[
  {
    "_id": "ObjectId",
    "title": "...",
    "authorId": { "_id": "ObjectId", "name": "..." },
    "price": 29.99,
    "publishedYear": 2023,
    "genres": ["Programming"],
    "inStock": true,
    "rating": 4.5
  }
]
