export interface ValidationError {
    field: string;
    defaultMessage: string;
}

export interface SpringBootErrorResponse {
    status: number; // HTTP status code
    error: string;  // Short error description (e.g., "Bad Request")
    message: string; // Detailed error message
    errors?: ValidationError[]; // Optional field for validation errors
}

export const formatSpringBootError = (error: SpringBootErrorResponse): string => {
    let errorDetails = "";

    if (Array.isArray(error.errors)) {
        errorDetails = error.errors
            .map((err: ValidationError) => err.defaultMessage) // Extract only `defaultMessage`
            .filter(Boolean) // Remove undefined/null values
            .join("\n"); // Join messages with new lines
    } else {
        errorDetails = "No detailed errors provided.";
    }

    return `Error message: ${error.message}\nError details:\n${errorDetails}`;
};
