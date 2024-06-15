const express = require('express');
const dotenv = require('dotenv');
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:3001/callback';
const jwtSecret = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const jwtSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
});

const JWT = mongoose.model('JWT', jwtSchema);

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

app.get('/', (req, res) => {
    res.send('Backend API is running');
});

app.get('/login', (req, res) => {
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

app.get('/callback', (req, res) => {
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

                const options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                request.get(options, (error, response, body) => {
                    console.log(body);
                });

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
                }).catch(err => {
                    console.error('Error saving JWT:', err);
                });

                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token,
                        jwt: token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
