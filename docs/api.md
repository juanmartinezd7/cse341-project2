# Bookstore API – Documentation

Base URL (local):  
`http://localhost:4000`

Deployed URL (Render):  
`https://bookstore-api-qydz.onrender.com`

---

## Overview

The Bookstore API is a RESTful web service built with:

- Node.js & Express  
- MongoDB & Mongoose  
- OAuth authentication with GitHub  
- Swagger (OpenAPI) for interactive documentation  

The API exposes endpoints to manage **Books** and **Authors**, with:

- Full CRUD (GET, POST, PUT, DELETE)  
- Data validation on POST and PUT  
- Centralized error handling  
- Authentication required for modifying data  

Swagger UI (interactive docs) is available at:

- Local: `http://localhost:4000/api-docs`  
- Deployed: `https://bookstore-api-qydz.onrender.com/api-docs`

---

## Authentication (OAuth with GitHub)

The API uses **GitHub OAuth** for authentication via sessions.  
Once a user logs in with GitHub, they can access **protected routes** (POST, PUT, DELETE).

### `GET /auth/github`

Starts the GitHub OAuth flow.  
Redirects the user to GitHub to log in and authorize the application.

---

### `GET /auth/github/callback`

Callback URL configured in the GitHub OAuth app.  
GitHub redirects the user here after login.

On success, the server creates/loads a user in MongoDB and authenticates the session.

**Example 200 Response:**

```json
{
  "message": "Logged in with GitHub",
  "user": {
    "id": "671a1234abcd56789eee1234",
    "githubId": "12345678",
    "username": "yourusername",
    "displayName": "Your Name",
    "email": "you@example.com"
  }
}



