const express = require('express');
const jwt = require('jsonwebtoken');
const JWT = require('../models/jwtModel');
const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

console.log('JWT_SECRET in validate.js:', jwtSecret); // Log the JWT_SECRET for debugging

// Validate JWT Status
router.get('/validate-token', (req, res) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader); // Log the header for debugging

    if (!authHeader) {
        console.log('No Authorization header found');
        return res.status(401).send({ valid: false });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token); // Log the token for debugging
    console.log('JWT_SECRET in validate.js:', jwtSecret); // Log the secret key

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err); // Log any JWT verification errors
            return res.status(401).send({ valid: false });
        }

        console.log('Decoded JWT:', decoded); // Log decoded token for debugging
        res.send({ valid: true, decoded });
    });
});



// router.get('/verify-test-token', (req, res) => {
//     const authHeader = req.header('Authorization');
//     console.log('Authorization Header:', authHeader); // Log the header for debugging
//
//     if (!authHeader) {
//         console.log('No Authorization header found');
//         return res.status(401).send({ valid: false });
//     }
//
//     const token = authHeader.replace('Bearer ', '');
//     console.log('Token:', token); // Log the token for debugging
//
//     jwt.verify(token, jwtSecret, (err, decoded) => {
//         if (err) {
//             console.error('JWT Verification Error:', err); // Log any JWT verification errors
//             return res.status(401).send({ valid: false });
//         }
//
//         console.log('Decoded JWT:', decoded); // Log decoded token for debugging
//         res.send({ valid: true, decoded });
//     });
// });

module.exports = router;
