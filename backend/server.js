const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Backend API is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
