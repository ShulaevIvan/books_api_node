const express = require('express');
const router = express.Router();
const database = require('../database/database');

router.get('/', (req, res) => {
    const books = database.getBooks();
    res.render('index', {books: books});
});


module.exports = router;