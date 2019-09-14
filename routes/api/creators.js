const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Creator = require('../../models/Creator');

// ROUTE          POST api/creators
// DESCRIPTION    Test route
// ACCESS         Public
router.post(
	'/',
	[
		check('name', 'Name is required')
			.not()
			.isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let creator = await Creator.findOne({ email });

			if (creator) {
				return res.status(400).json({ errors: [{ msg: 'Creator already exists ' }] });
			}

			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			creator = new Creator({
				name,
				email,
				avatar,
				password,
			});

			const salt = await bcrypt.genSalt(10);

			creator.password = await bcrypt.hash(password, salt);

			await creator.save();

			const payload = {
				creator: {
					id: creator.id,
				},
			};

			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
