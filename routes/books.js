const express = require('express');
const router = express.Router();
const database = require('../database/database');
const uploadMiddleware = require('../middleware/bookFileLoad')

router.get('/create', (req, res) => {
    res.render('books/create');
});

router.post('/create', uploadMiddleware.single('fileBook'), (req, res) => {
    try {
        const data = req.body;
        data.fileBook = req.file ? req.file.path : 'public/uploads/book_holder.png';
        data.fileName = req.file ? req.file.filename : 'book_holder.png';
        const createdBook = database.createBook(data);
        res.status(201);
        res.redirect('/');
    }
    catch(err) {
        response.send(err);
    }
    // res.redirect('/')
});

router.get('/view/:id', (req, res) => {
    const targetId = req.params.id;
    const targetBook = database.getBooks(many=false, targetId);

    res.render('books/view', { book: targetBook});
});


module.exports = router;