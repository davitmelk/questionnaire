import { Request, Response, NextFunction } from 'express';

const httpStatus: any = {
    400: 'Error in the structure of the transmitted request',
    403: 'You are not authorized to view this object.',
    404: 'The requested resource does not exist.',
    500: 'An unexpected error occurred while processing the request.'
};

const httpError = (req: Request, res: Response, next: NextFunction) => {
    res.httpError = function (statusCode: number, message?: string | null) {
        res.status(statusCode).json({
            error: message || httpStatus[statusCode],
            statusCode: statusCode
        })
    };

    next();
};

export default httpError;