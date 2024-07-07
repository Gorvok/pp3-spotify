const express = require('express');
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const JWT = require('../models/jwtModel');

const router = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:3001/callback';
const jwtSecret = process.env.JWT_SECRET;

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

// Authorization Request
router.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

// Callback Handling and Token Exchange
router.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token,
                    refresh_token = body.refresh_token;

                // Generate JWT
                const token = jwt.sign({ access_token }, jwtSecret, { expiresIn: '1h' });

                // Save JWT to database
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                const jwtDoc = new JWT({
                    token: token,
                    expiry: expiryDate
                });

                jwtDoc.save().then(() => {
                    console.log('JWT saved to database');
                    res.redirect(`http://localhost:3000/?jwt=${token}&access_token=${access_token}&refresh_token=${refresh_token}`);
                }).catch(err => {
                    console.error('Error saving JWT:', err);
                    res.redirect('/#' +
                        querystring.stringify({
                            error: 'token_save_error'
                        }));
                });
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

// Endpoint to validate the token
router.get('/validate-token', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        res.json({ valid: true, decoded });
    });
});

module.exports = router;
