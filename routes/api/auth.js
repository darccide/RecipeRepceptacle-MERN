const express = require('express');
const router = express.Router();

// ROUTE          GET api/auth
// DESCRIPTION    Test route
// ACCESS         Public
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;
