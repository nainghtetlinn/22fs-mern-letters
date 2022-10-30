const express = require('express');
const helmet = require('helmet');
require('colors');
require('dotenv').config();

// Connect to the database
require('./config/db')();
const { errorHandler } = require('./middlewares/errorMiddleware');
const { protect } = require('./middlewares/authMiddleware');

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/posts', protect, require('./routes/postRoute'));
app.use('/api/comments', protect, require('./routes/commentRoute'));
app.use('/api/likes', protect, require('./routes/likeRoute'));
app.use('/api/follow', protect, require('./routes/followRoute'));
app.use('/api/search', protect, require('./routes/searchRoute'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
