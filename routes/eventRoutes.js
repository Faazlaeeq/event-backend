const express = require('express');
const router = require('express-promise-router')();
const eventController = require('../controllers/eventController');

router.route('/create')
.post(eventController.createEvent)

router.route('/:category')
.get(eventController.getEventsByCategory)


module.exports = router; 

