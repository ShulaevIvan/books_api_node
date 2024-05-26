const express = require('express');
const router = express.Router();
const database = require('../database.js');

router.get('/', (request, response) => {
    response.sendFile(`${__dirname}/src/index.html`);
});

module.exports = router;