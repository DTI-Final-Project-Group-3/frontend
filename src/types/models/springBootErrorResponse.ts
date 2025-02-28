export interface SpringBootErrorResponse {
    status: number; // HTTP status code
    error: string;  // Short error description (e.g., "Bad Request")
    message: string; // Detailed error message
    errors?: Record<string, string[]>; // Optional field for validation errors (e.g., { "email": ["Invalid format"] })
}

export const formatSpringBootError = (error: SpringBootErrorResponse): string => {
    let errorDetails = "";

    if (Array.isArray(error.errors)) {
        errorDetails = error.errors
            .map((err: any) => err.defaultMessage) // Extract only `defaultMessage`
            .filter(Boolean) // Remove undefined/null values
            .join("\n"); // Join messages with new lines
    } else {
        errorDetails = "No detailed errors provided.";
    }

    return `Error message: ${error.message}\nError details:\n${errorDetails}`;
};