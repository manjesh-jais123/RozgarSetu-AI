export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: {
    code: string;
    details?: unknown;
  } | null;
}

export const createResponse = <T>(
  success: boolean,
  message: string,
  data: T | null = null,
  error: { code: string; details?: unknown } | null = null
): ApiResponse<T> => {
  return { success, message, data, error };
};

export const successResponse = <T>(message: string, data: T): ApiResponse<T> => {
  return createResponse(true, message, data, null);
};

export const errorResponse = (message: string, code: string, details?: unknown): ApiResponse<null> => {
  return createResponse(false, message, null, { code, details });
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};