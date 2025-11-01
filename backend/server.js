const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
