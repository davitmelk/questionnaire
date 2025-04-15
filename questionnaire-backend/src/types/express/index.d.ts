declare namespace Express {
    export interface Response {
        httpError: (statusCode: number, message?: string | null) => void;
    }
}