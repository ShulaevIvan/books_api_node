const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/bookFileLoad.js');
const database = require('../database.js');
const fs = require('fs');

router.get('/', async (request, response) => {
    try {
        const books = await database.getBooks();

        response.status(200);
        response.json(books);
    }
    catch(err) {
        response.send(err);
    }
});

router.get('/:id', async (request, response) => {
    const targetId = request.params.id;
    

    try {
        const targetBook = await database.getBooks(many=false, targetId);

        if(targetBook) {
            response.status(200);
            response.json(targetBook);
            return;
        }
        response.status(404);
        response.json({'status': '404 not found'});
    }
    catch(err) {
        response.send(err);
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
        response.json({'status': '404 not found'});
    }
    catch(err) {
        response.send(err);
    }
});

router.post('/', uploadMiddleware.single('fileBook'), async (request, response) => {
    const data = request.body;
    try {
        data.fileBook = request.file ? request.file.path : 'src/images/book_holder.png';
        data.fileName = request.file ? request.file.filename : 'book_holder.png';
        const createdBook = database.createBook(data);
        response.status(201);
        response.json(createdBook);
    }
    catch(err) {
        response.send(err);
    }
});

router.put('/:id', uploadMiddleware.single('fileBook'), async (request, response) => {
    targetId = request.params.id;
    const data = request.body;
    

    try {
        data.fileBook = request.file ? request.file.path : 'src/images/book_holder.png';
        const targetBook = await database.editBook(targetId, data);

        if(targetBook) {
            response.status(201);
            response.json(targetBook);
            return;
        }
        response.status(404);
        response.json({'status': '404 not found'});
    }
    catch(err) {
        response.send(err);
    }
});

router.delete('/:id', async (request, response) => {
    const targetId = request.params.id;
    

    try {
        database.deleteBook(targetId);
        response.status(200);
        response.json({'status': 'ok'});
    }
    catch(err) {
        response.send(err);
    }
});

module.exports = router;