const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server works at port ${PORT}!`);
  });
};

start();
