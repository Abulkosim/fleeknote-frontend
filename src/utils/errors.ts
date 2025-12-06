interface ValidationError {
    field: string;
    message: string;
}

interface ApiErrorResponse {
    status: string;
    message: string;
    errors?: ValidationError[];
}

export function extractErrorMessage(err: unknown, fallbackMessage: string): string {
    if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as any).response;

        if (response?.data) {
            const data: ApiErrorResponse = response.data;

            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const fieldErrors = data.errors.map((error) => {
                    const fieldName = error.field.replace(/^(body|query|params)\./, '');
                    return `${fieldName}: ${error.message}`;
                });

                return fieldErrors.join(', ');
            }

            if (data.message) {
                return data.message;
            }
        }
    }

    if (err && typeof err === 'object' && 'message' in err) {
        return (err as Error).message;
    }

    return fallbackMessage;
}
