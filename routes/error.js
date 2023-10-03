const express = require('express');
const path = require('path');
const router = express.Router();

const errorController = require('../controllers/error'); 

router.use(errorController.getErrorController)

module.exports = router;