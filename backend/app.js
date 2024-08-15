const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const yelpRouter = require('./routes/yelp');
const errorHandler = require('./middlewares/errorHandler');
const imageRecognitionRoutes = require('./routes/imageRecognition');
const app = express();

app.use(cors({
    origin: process.env.URL_FRONTEND,
    credentials: true
}));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/api', yelpRouter);
app.use('/products', productRoutes);
app.use('/api', imageRecognitionRoutes);

app.use(errorHandler);

module.exports = app;
