const express = require('express');
const fs = require('fs');
const router = express.Router();
const database = require('../database/database');
const uploadMiddleware = require('../middleware/bookFileLoad');

router.get('/create', (req, res) => {
    res.render('books/create');
});

router.post('/create', uploadMiddleware.single('fileBook'), async (req, res) => {
    try {
        const data = req.body;
        data.fileBook = req.file ? req.file.path : 'public/uploads/book_holder.png';
        data.fileName = req.file ? req.file.filename : 'book_holder.png';
        const createdBook = await database.createBook(data);
        res.status(201);
        res.redirect('/');
    }
    catch(err) {
        response.send(err);
    }
});

router.get('/update/:id', async (req, res) => {
    const targetId = req.params.id;
    const targetBook = await database.getBooks(many=false, targetId);

    res.render('books/update', { book: targetBook });
});

router.post('/update/:id', uploadMiddleware.single('fileBook'), async (req, res) => {

    try {
        const targetId = req.params.id;
        const data = req.body;
        data.fileBook = req.file ? req.file.path : 'public/uploads/book_holder.png';
        const targetBook = await database.editBook(targetId, data);

        if(targetBook) {
            res.status(201);
            res.redirect('/');
            return;
        }
        res.status(404);
        res.json({'status': '404 not found'});
    }
    catch(err) {
        res.send(err);
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        const targetId = req.params.id;
        database.deleteBook(targetId);
        res.status(200);
        res.redirect('/');
    }
    catch(err) {
        res.send(err);
    }
});

router.get('/view/:id', async (req, res) => {
    try {
        const targetId = req.params.id;
        const targetBook = await database.getBooks(many=false, targetId);

        res.render('books/view', { book: targetBook });
    }
    catch(err) {
        res.send(err);
    }
    
});

router.get('/:id/download', async (request, response) => {
    
    try {
        const targetId = request.params.id;
        const targetBookImage = database.downloadBookImage(targetId);

        if(targetBookImage && fs.existsSync(targetBookImage)) {
            response.status(200);
            response.download(targetBookImage);
            return;
        }
        response.status(404);
    }
    catch(err) {
        response.send(err);
    }
});


module.exports = router;