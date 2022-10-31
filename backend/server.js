const path = require('path');
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

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
