export interface PaginationRequest {
    page: number;
    pageSize: number;
    orderBy?: { [key: string]: 'asc' | 'desc' };
    search?: string;
    filters?: { [key: string]: any };
}

export interface PaginationResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
