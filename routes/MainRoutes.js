const express = require('express');
const router = express.Router();
const { readData, createData, readOneLastData, readDataAirPerDay, readDataAirPerWeek, readDataAirPerMonth, readDataTempraturePerDay, readDataTempraturePerWeek, readDataTempraturePerMonth} = require('../controllers/MainController');

// GET /data
router.get('/data/history', readData);
router.get('/data/last', readOneLastData)
router.get('/data/air/daily', readDataAirPerDay)
router.get('/data/air/weekly', readDataAirPerWeek)
router.get('/data/air/monthly', readDataAirPerMonth)
router.get('/data/temprature/daily', readDataTempraturePerDay)
router.get('/data/temprature/weekly',readDataTempraturePerWeek)
router.get('/data/temprature/monthly', readDataTempraturePerMonth)


// POST /data
router.post('/data/create', createData);

module.exports = router;
