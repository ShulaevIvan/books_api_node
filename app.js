const express = require('express');
const multer  = require("multer");
const os = require('os');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const HOST = os.networkInterfaces().lo[0].address;
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/uploads/')));
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/', booksRouter);
app.listen(PORT);
console.log(`server started at: \n http://${HOST}:${PORT} \n http://localhost:${PORT}`);
