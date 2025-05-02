import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];  //Bearer რომ მოცილდეს ტოკენიდან
    if (!token) {
        return res.status(401).json({ error: 'Unautorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}

