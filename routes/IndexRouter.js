var express = require('express');
const { homeView , urlScanner} = require('../controllers/IndexController');
var router = express.Router();

/* GET home page. */
router.get('/', homeView);

router.post("/extract", urlScanner)

module.exports = router;
