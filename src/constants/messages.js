const MESSAGES = {
  // Auth related messages
    TOKEN_MISSING: 'You are not logged in. Please log in to get access.',
    TOKEN_USER_NOT_EXIST: 'The user belonging to this token no longer exists.',
    TOKEN_INVALID: 'Invalid token or authorization error',
    USER_ALREADY_EXISTS: 'User with this email or username already exists',
    INVALID_CREDENTIALS: 'Incorrect email or password',

    // Review related messages
    REVIEW_ALREADY_EXISTS: 'You have already reviewed this book',
    REVIEW_NOT_FOUND: 'Review not found',
    REVIEW_UPDATE_UNAUTHORIZED: 'You can only update your own reviews',
    REVIEW_DELETE_UNAUTHORIZED: 'You can only delete your own reviews',
    REVIEW_DELETED: 'Review deleted successfully',

    // Book related messages
    BOOK_NOT_FOUND: 'Book not found',
    SEARCH_QUERY_REQUIRED: 'Search query is required',

    // Validation messages
    VALIDATION_FAILED: 'Validation failed',

    // Success messages
    SUCCESS: 'Success',
    CREATED: 'Resource created successfully'
};

module.exports = MESSAGES; 