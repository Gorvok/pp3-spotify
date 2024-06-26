const express = require('express');
const jwt = require('jsonwebtoken');
const JWT = require('../models/jwtModel');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// Validate JWT Status
router.get('/validate-token', verifyJWT, (req, res) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.send({ valid: false });
    }

    const token = authHeader.replace('Bearer ', '');

    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            return res.send({ valid: false });
        }

        const jwtDoc = await JWT.findOne({ token });
        if (!jwtDoc) {
            return res.send({ valid: false });
        }

        const isExpired = jwtDoc.expiry <= new Date();
        res.send({ valid: !isExpired });
    });
});

module.exports = router;
