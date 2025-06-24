const router = require('express').Router();
const { employeeLogin } = require('../controllers/empauthController');

router.post('/emplogin', employeeLogin);

module.exports = router;
