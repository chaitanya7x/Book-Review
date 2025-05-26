# Book Review API

A RESTful API built with Node.js, Express, and MongoDB for a basic Book Review system.

## Database Schema

### User Schema
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timestamps: true
}
```

### Book Schema
```javascript
{
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  timestamps: true
}
```

### Review Schema
```javascript
{
  book: { type: ObjectId, ref: 'Book', required: true },
  user: { type: ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  timestamps: true
}
```

## Screenshots

### Home Page - Discover Books
![Home Page](./screenshots/Screenshot%20(372).png)

### Login Page
![Login Page](./screenshots/Screenshot%20(371).png)

### Sign Up Page
![Sign Up Page](./screenshots/Screenshot%20(369).png)

### Book Details & Review Submission
![Book Detail Page](./screenshots/Screenshot%20(368).png)

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd book-review-api
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Start the server:
   ```
   npm start
   ```

## Example API Requests

### Authentication

- **Signup**:
  ```
  curl -X POST http://localhost:3000/auth/signup -H "Content-Type: application/json" -d '{"username":"user1","email":"user1@example.com","password":"password123"}'
  ```

- **Login**:
  ```
  curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"user1@example.com","password":"password123"}'
  ```

### Books

- **Add a Book**:
  ```
  curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -H "x-auth-token: <your_token>" -d '{"title":"Book Title","author":"Author Name","genre":"Fiction","description":"Book description"}'
  ```

- **Get All Books**:
  ```
  curl http://localhost:3000/books
  ```

- **Get Book by ID**:
  ```
  curl http://localhost:3000/books/<book_id>
  ```

- **Search Books**:
  ```
  curl http://localhost:3000/books/search?query=title
  ```

### Reviews

- **Add a Review**:
  ```
  curl -X POST http://localhost:3000/reviews/<book_id> -H "Content-Type: application/json" -H "x-auth-token: <your_token>" -d '{"rating":5,"comment":"Great book!"}'
  ```

- **Update a Review**:
  ```
  curl -X PUT http://localhost:3000/reviews/<review_id> -H "Content-Type: application/json" -H "x-auth-token: <your_token>" -d '{"rating":4,"comment":"Updated comment"}'
  ```

- **Delete a Review**:
  ```
  curl -X DELETE http://localhost:3000/reviews/<review_id> -H "x-auth-token: <your_token>"
  ```

## Design Decisions

- Used JWT for authentication to ensure secure and stateless user sessions.
- Implemented pagination and filtering for book listings to handle large datasets efficiently.
- Used Mongoose for MongoDB interactions to leverage schema validation and middleware. 

