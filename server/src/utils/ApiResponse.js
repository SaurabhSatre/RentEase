class ApiResponse {
  constructor({ statusCode = 200, message = "Request successful", data = null }) {
    this.status = "success";
    this.statusCode = statusCode;
    this.message = message;
    this.results = Array.isArray(data) ? data.length : undefined;
    this.data = data;
  }
}

export default ApiResponse;