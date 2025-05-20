# Book Review API

A RESTful API for a book review system built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- CRUD operations for books and reviews
- Search functionality for books
- Pagination for books and reviews
- Author and genre filtering

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd book-review-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book_review_api
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register a new user
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Books

#### Get all books (with pagination and filters)
```
GET /api/books?page=1&limit=10&author=John%20Doe&genre=Fiction
```

#### Get book by ID (with reviews)
```
GET /api/books/:id?reviewPage=1&reviewLimit=10
```

#### Add new book (requires authentication)
```
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Book",
  "author": "John Doe",
  "genre": "Fiction",
  "description": "A wonderful book about...",
  "publishedYear": 2023,
  "isbn": "978-3-16-148410-0"
}
```

#### Search books
```
GET /api/books/search/query?q=great%20book
```

### Reviews

#### Submit a review (requires authentication)
```
POST /api/reviews/:bookId
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "An excellent book that..."
}
```

#### Update review (requires authentication)
```
PUT /api/reviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review..."
}
```

#### Delete review (requires authentication)
```
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

## Database Schema

### User
- username (String, required, unique)
- email (String, required, unique)
- password (String, required, hashed)
- timestamps

### Book
- title (String, required)
- author (String, required)
- genre (String, required)
- description (String, required)
- publishedYear (Number)
- isbn (String, unique)
- timestamps
- Virtual field for reviews

### Review
- book (ObjectId, ref: 'Book')
- user (ObjectId, ref: 'User')
- rating (Number, required, 1-5)
- comment (String, required)
- timestamps

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Features

- Password hashing using bcryptjs
- JWT-based authentication
- Protected routes for authenticated users
- Input validation and sanitization
- One review per user per book enforcement

## Project Structure

```
src/
├── controllers/     # Request handlers
├── models/         # Database models
├── middleware/     # Custom middleware
├── routes/         # API routes
├── validators/     # Input validation
├── presenters/     # Response formatting
├── utils/          # Helper utilities
└── constants/      # Constant values
```

## Presenters

The presenter pattern is used to format and standardize API responses. Each presenter provides consistent data transformation for its respective model.

### Available Presenters

1. **ReviewPresenter**
```javascript
// Format a single review
const review = ReviewPresenter.present(reviewData);

// Format multiple reviews
const reviews = ReviewPresenter.presentMany(reviewsArray);
```

Response format:
```json
{
  "id": "reviewId",
  "rating": 5,
  "comment": "Great book!",
  "book": "bookId",
  "user": "userId",
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

2. **BookPresenter**
```javascript
// Format a single book
const book = BookPresenter.present(bookData);

// Format multiple books
const books = BookPresenter.presentMany(booksArray);
```

Response format:
```json
{
  "id": "bookId",
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "isbn": "1234567890",
  "publishedYear": 2024,
  "averageRating": 4.5,
  "totalReviews": 10,
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

3. **UserPresenter**
```javascript
// Format a single user
const user = UserPresenter.present(userData);

// Format multiple users
const users = UserPresenter.presentMany(usersArray);

// Format user with authentication token
const authenticatedUser = UserPresenter.presentWithToken(userData, token);
```

Response format:
```json
{
  "id": "userId",
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

## Validators

The validator pattern ensures data integrity by validating input before processing. Each validator uses Joi schemas for validation.

### Available Validators

1. **ReviewValidator**
```javascript
const validator = new ReviewValidator('create');
if (!validator.validate(requestData)) {
  // Handle validation errors
  const errors = validator.errors;
}
```

Validation rules:
- create: Validates new review creation
- update: Validates review updates
- id: Validates review ID format

2. **BookValidator**
```javascript
const validator = new BookValidator('create');
if (!validator.validate(requestData)) {
  // Handle validation errors
  const errors = validator.errors;
}
```

Validation rules:
- create: Validates new book creation
- update: Validates book updates
- id: Validates book ID format

3. **AuthValidator**
```javascript
const validator = new AuthValidator('register');
if (!validator.validate(requestData)) {
  // Handle validation errors
  const errors = validator.errors;
}
```

Validation rules:
- register: Validates user registration data
- login: Validates login credentials

### Usage in Controllers

```javascript
async createReview(req, res) {
  const validator = new ReviewValidator('create');
  if (!validator.validate({ ...req.body, bookId: req.params.bookId })) {
    return res.status(400).json(
      ApiResponse.badRequest(MESSAGES.VALIDATION_FAILED, { errors: validator.errors })
    );
  }
  
  const review = await Review.create(validator.value);
  res.status(201).json(
    ApiResponse.created({ review: ReviewPresenter.present(review) })
  );
}
```

## Error Handling

Both Presenters and Validators work with the `ApiResponse` utility to provide consistent error responses:

```javascript
// Validation error response
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "rating",
      "message": "Rating must be between 1 and 5"
    }
  ]
}

// Successful response
{
  "status": "success",
  "data": {
    "review": {
      // Presented review data
    }
  }
}
```