# Blog API

A RESTful Blog API built with Node.js, Express, MongoDB, and JWT authentication.

## Live URL
https://blog-api-khfd.onrender.com

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image upload)

## Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Posts
- GET /api/posts
- GET /api/posts/:id
- POST /api/posts (protected)
- PUT /api/posts/:id (protected)
- DELETE /api/posts/:id (protected)

### Comments
- GET /api/comments/:postId
- POST /api/comments/:postId (protected)
- DELETE /api/comments/:id (protected)

### Likes
- GET /api/likes/:postId
- POST /api/likes/:postId (protected)
- DELETE /api/likes/:postId (protected)
