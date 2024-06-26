const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).send({ error: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyJWT;
