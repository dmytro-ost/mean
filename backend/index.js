require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('mongoose-morgan');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(
  morgan(
    {
      connectionString: process.env.DB_CONNECT_STRING
    },
    {},
    'combined'
  )
);

const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const truckRouter = require('./routers/truckRouter');
const loadRouter = require('./routers/loadRouter');

app.use('/api/', userRouter);
app.use('/api/', authRouter);
app.use('/api/', truckRouter);
app.use('/api/', loadRouter);

app.all('*', (req, res) => {
  res.status(400).json({ message: 'Bad request.' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);

    app.listen(PORT, () => {
      console.log(`Server works at port ${PORT}!`);
    });
  }
  catch (error) {
    console.log(error);
  }
};

start();
