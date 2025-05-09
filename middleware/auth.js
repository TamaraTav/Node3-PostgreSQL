import jwt from 'jsonwebtoken';
import { handleJWTError} from "../utils/errorhandler.js";

export const auth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];  //Bearer რომ მოცილდეს ტოკენიდან
    if (!token) {
        return res.status(401).json({ error: 'Unautorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(handleJWTError);
        }
        req.user = decoded;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ error: 'Only Admins can access this action' });
    }

    next();
}

