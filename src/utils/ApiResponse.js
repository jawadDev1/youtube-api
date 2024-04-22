class ApiResponse {
    constructor(
        success,
        message = "Success",
        data
    ){
        this.message = message;
        this.data = data
        this.success = success
    }
}

export { ApiResponse }