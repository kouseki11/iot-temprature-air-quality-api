const express = require('express');
const router = express.Router();
const { readData, createData, readOneLastData} = require('../controllers/MainController');

// GET /data
router.get('/data/history', readData);
router.get('/data/last', readOneLastData)


// POST /data
router.post('/data/create', createData);

module.exports = router;
