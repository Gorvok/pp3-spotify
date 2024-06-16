const mongoose = require('mongoose');

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

module.exports = JWT;
