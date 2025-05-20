class ApiResponse {
    static success(data = null, message = 'Success') {
        return {
        status: 'success',
        message,
        data
        };
    }

    static created(data = null, message = 'Resource created successfully') {
        return {
        status: 'success',
        message,
        data
        };
    }

    static error(statusCode, message) {
        return {
        status: 'error',
        statusCode,
        message
        };
    }

    static badRequest(message = 'Bad request', data = null) {
        return {
        status: 'error',
        statusCode: 400,
        message,
        data
        };
    }

    static unauthorized(message = 'Unauthorized') {
        return {
        status: 'error',
        statusCode: 401,
        message
        };
    }

    static forbidden(message = 'Forbidden') {
        return {
        status: 'error',
        statusCode: 403,
        message
        };
    }

    static notFound(message = 'Not found') {
        return {
        status: 'error',
        statusCode: 404,
        message
        };
    }
}

module.exports = ApiResponse; 