require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');

const database = require('./database.js');

const PORT = process.env.PORT || 3000;
const HOST = os.networkInterfaces().lo[0].address;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src'));

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/src/index.html`);
});

app.get('/api/books/', async (request, response) => {
    const books = await database.getBooks();

    response.status(200);
    response.json(books);
});

app.get('/api/books/:id', async (request, response) => {
    const targetId = request.params.id;
    const targetBook = await database.getBooks(many=false, targetId);

    try {
        if (targetBook) {
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

app.post('/api/user/login/', async (request, response) => {
    try {
        response.status(201);
        response.json(await database.authUser());
    }
    catch(err) {
        response.send(err);
    }
});

app.post('/api/books/', async (request, response) => {
    const data = request.body;
    const createdBook = await database.createBook(data);

    try {
        response.status(201);
        response.json(createdBook);
    }
    catch(err) {
        response.send(err);
    }
});

app.put('/api/books/:id', async (request, response) => {
    targetId = request.params.id;
    const data = request.body;
    const targetBook = await database.editBook(targetId, data);

    try {
        if (targetBook) {
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
})

app.delete('/api/books/:id', async (request, response) => {
    const targetId = request.params.id;
    await database.deleteBook(targetId);

    try {
        response.status(200);
        response.json({'status': 'ok'});
    }
    catch(err) {
        response.send(err);
    }
});


app.listen(PORT);
console.log(`server started at: \n http://${HOST}:${PORT} \n http://localhost:${PORT}`);


