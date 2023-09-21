const express = require('express');
const router = express.Router();
const { readData, createData, readOneLastData, readDataAirPerDay, readDataAirPerWeek, readDataAirPerMonth, readDataTempraturePerDay, readDataTempraturePerWeek, readDataTempraturePerMonth, readAverageDataAirPerDay, readAverageDataTempraturePerDay, readAverageDataTempraturePerWeek, readAverageDataAirPerWeek, readAverageDataAirPerMonth, readAverageDataTempraturePerMonth} = require('../controllers/MainController');

// GET /data
router.get('/data/history', readData);
router.get('/data/last', readOneLastData);
router.get('/data/air/daily', readDataAirPerDay)
router.get('/data/air/daily/average', readAverageDataAirPerDay)
router.get('/data/air/weekly/average', readAverageDataAirPerWeek)
router.get('/data/air/monthly/average', readAverageDataAirPerMonth)
router.get('/data/air/weekly', readDataAirPerWeek)
router.get('/data/air/monthly', readDataAirPerMonth)
router.get('/data/temprature/daily', readDataTempraturePerDay)
router.get('/data/temprature/daily/average', readAverageDataTempraturePerDay)
router.get('/data/temprature/weekly/average', readAverageDataTempraturePerWeek)
router.get('/data/temprature/monthly/average', readAverageDataTempraturePerMonth)
router.get('/data/temprature/weekly',readDataTempraturePerWeek)
router.get('/data/temprature/monthly', readDataTempraturePerMonth)


// POST /data
router.post('/data/create', createData);

module.exports = router;
