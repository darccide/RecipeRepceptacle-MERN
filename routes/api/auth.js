const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Creator = require('../../models/Creator');

// ROUTE          GET api/auth
// DESCRIPTION    Test route
// ACCESS         Public
router.get('/', auth, async (req, res) => {
	try {
		const creator = await Creator.findById(req.creator.id).select('-password');
		res.json(creator);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
