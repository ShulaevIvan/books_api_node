require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');

const booksRouter = require('./routes/books.js');
const userRouter = require('./routes/user.js');
const indexRouter = require('./routes/user.js');

const PORT = process.env.PORT || 3000;
const HOST = os.networkInterfaces().lo[0].address;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src/'));

app.use('/api/books', booksRouter);
app.use('/api/user', userRouter);
app.use('/', indexRouter);

app.listen(PORT);
console.log(`server started at: \n http://${HOST}:${PORT} \n http://localhost:${PORT}`);


