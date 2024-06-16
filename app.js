require('dotenv').config();

const express = require('express');
const os = require('os');
const path = require('path');

const indexRouter = require('./routes/index.js');
const booksRouter = require('./routes/books.js');
const userRouter = require('./routes/user.js');


const PORT = process.env.PORT || 3000;
const HOST = os.networkInterfaces().lo[0].address;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src/'));
app.use('images', express.static(__dirname + '/src/images/'));
app.use('/', indexRouter);
app.use('/api/books', booksRouter);
app.use('/api/user', userRouter);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.listen(PORT);
console.log(`server started at: \n http://${HOST}:${PORT} \n http://localhost:${PORT}`);


