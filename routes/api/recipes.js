const express = require('express');
const router = express.Router();

// ROUTE          GET api/recipes
// DESCRIPTION    Test route
// ACCESS         Public
router.get('/', (req, res) => res.send('Recipe route'));

module.exports = router;
