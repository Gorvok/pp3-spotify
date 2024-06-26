const express = require('express');
const request = require('request');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

// Fetch User's Playlists
router.get('/playlists', verifyJWT, (req, res) => {
    const accessToken = req.user.access_token;

    const options = {
        url: 'https://api.spotify.com/v1/me/playlists',
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

// Fetch User's Top Tracks
router.get('/top-tracks', verifyJWT, (req, res) => {
    const accessToken = req.user.access_token;

    const options = {
        url: 'https://api.spotify.com/v1/me/top/tracks',
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

// Fetch User's Recently Played Tracks
router.get('/recently-played', verifyJWT, (req, res) => {
    const accessToken = req.user.access_token;

    const options = {
        url: 'https://api.spotify.com/v1/me/player/recently-played',
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
