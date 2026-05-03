class ApiResponse {
    constructor(success, data = null, message = null, error = null) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
        this.timestamp = new Date().toISOString();
    }

    static success(data, message = 'Operation successful') {
        return new ApiResponse(true, data, message);
    }

    static error(error, message = 'Operation failed') {
        return new ApiResponse(false, null, message, error);
    }
}

module.exports = ApiResponse;
