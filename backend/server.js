const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from the frontend
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use((req, res, next) => {
    console.log('CORS headers set');
    next();
});

app.use(cookieParser());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI);

app.get('/', (req, res) => {
    res.send('Backend API is running');
});

// Use Routes
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const spotifyRoutes = require('./routes/spotify');
const validateRoutes = require('./routes/validate');

app.use('/', authRoutes);
app.use('/', searchRoutes);
app.use('/', spotifyRoutes);
app.use('/', validateRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
