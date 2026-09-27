export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    error: {
        code: string;
        details?: unknown;
    } | null;
}
export declare const createResponse: <T>(success: boolean, message: string, data?: T | null, error?: {
    code: string;
    details?: unknown;
} | null) => ApiResponse<T>;
export declare const successResponse: <T>(message: string, data: T) => ApiResponse<T>;
export declare const errorResponse: (message: string, code: string, details?: unknown) => ApiResponse<null>;
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare const createPaginatedResponse: <T>(data: T[], total: number, page: number, limit: number) => PaginatedResponse<T>;
//# sourceMappingURL=types.d.ts.map