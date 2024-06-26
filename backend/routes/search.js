const express = require('express');
const request = require('request');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

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
