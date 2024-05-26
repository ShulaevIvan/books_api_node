const express = require('express');
const router = express.Router();
const database = require('../database.js');

router.post('/login/', async (request, response) => {
    try {
        response.status(201);
        response.json(await database.authUser());
    }
    catch(err) {
        response.send(err);
    }
});

module.exports = router;