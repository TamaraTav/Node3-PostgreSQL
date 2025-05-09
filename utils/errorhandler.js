
export class AppError extends Error {
    constructor( message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errorMessage = message;
        Error.captureStackTrace(this, this.constructor);
    }
}


//მიდელვეარი
export const handleError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') { //დეველოპერისთის გამოაქვს ესეთი ერორი
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,  //ამ სტაკის მეშვეობით ერორში ზუსტად გიწერს კოდის რომელმა ხაზმა გაისროლა შეცდომა
        });
    } else if(process.env.NODE_ENV === 'production') { //კლიენტისთვის გამოაქვს მხოლოდ სტატუსი და მესიჯი
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    };

}