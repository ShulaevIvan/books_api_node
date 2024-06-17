const express = require('express');
const router = express.Router();
const database = require('../database.js');


router.get('/', (request, response) => {
    const books = database.getBooks();
    response.render('index', { books: books });
});

router.get('/create', (request, response) => {
    const books = database.getBooks();
    response.render('create', { books: books });
});

router.get('/update/:id', (request, response) => {
    const targetId = request.params.id;
    const targetBook = database.getBooks(many=false, targetId);

    response.render('update', { book: targetBook});
});

router.get('/:id', (request, response) => {
    const targetId = request.params.id;
    const targetBook = database.getBooks(many=false, targetId);

    response.render('view', { book: targetBook});
});



module.exports = router;