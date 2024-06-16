const express = require('express');
const request = require('request');
const jwt = require('jsonwebtoken');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// Verify JWT Middleware
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

// Search Endpoint
router.get('/search', verifyJWT, (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).send({ error: 'Missing search query' });
    }

    const accessToken = req.user.access_token;

    const options = {
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album,artist,track`,
        headers: { 'Authorization': 'Bearer ' + accessToken },
        json: true
    };

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body);
        } else {
            res.status(response.statusCode).send(body);
        }
    });
});

module.exports = router;
