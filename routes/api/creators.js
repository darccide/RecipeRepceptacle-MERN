const express = require('express');
const router = express.Router();

// ROUTE          GET api/creators
// DESCRIPTION    Test route
// ACCESS         Public
router.get('/', (req, res) => res.send('Creator route'));

module.exports = router;
