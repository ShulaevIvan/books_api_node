const express = require('express');
const router = express.Router();
const database = require('../database.js');
const books = database.getBooks();

router.get('/', (request, response) => {
    response.render('index', { books: books });
});

module.exports = router;