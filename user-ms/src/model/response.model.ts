export class ApiResponse<T> {
    data: T;
    message: string;
    code: string;
}