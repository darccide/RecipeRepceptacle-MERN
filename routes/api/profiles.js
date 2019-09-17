const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const Creator = require('../../models/Creator');

// ROUTE          GET api/profiles/me
// DESCRIPTION    Get current creators profile
// ACCESS         Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ creator: req.creator.id }).populate('creator', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this creator' });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// ROUTE          POST api/profiles
// DESCRIPTION    Create or update creator profile
// ACCESS         Private
router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required')
				.not()
				.isEmpty(),
			check('skills', 'Skills is required')
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body;

		// Build profile object
		const profileFields = {};
		profileFields.creator = req.creator.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (skills) {
			profileFields.skills = skills.split(',').map(skill => skill.trim());
		}

		// Build social object
		profileFields.social = {};
		if (youtube) profileFields.youtube = youtube;
		if (facebook) profileFields.facebook = facebook;
		if (twitter) profileFields.twitter = twitter;
		if (instagram) profileFields.instagram = instagram;
		if (linkedin) profileFields.linkedin = linkedin;

		try {
			let profile = await Profile.findOne({ creator: req.creator.id });

			if (profile) {
				// Update
				profile = await Profile.findOneAndUpdate(
					{ creator: req.creator.id },
					{ $set: profileFields },
					{ new: true }
				);
				// Return Profile
				return res.json(profile);
			}

			// Create
			profile = new Profile(profileFields);
			// Save Profile
			await profile.save();
			// Return profile
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// ROUTE          GET api/profiles
// DESCRIPTION    Get all profiles
// ACCESS         Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('creator', ['name', 'avatar']);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// ROUTE          GET api/profiles/creator/:creator_id
// DESCRIPTION    Get profile by creator ID
// ACCESS         Public
router.get('/creator/:creator_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({ creator: req.params.creator_id }).populate('creator', [
			'name',
			'avatar',
		]);

		if (!profile) return res.status(400).json({ msg: 'Profile not found' });

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' });
		}
		res.status(500).send('Server Error');
	}
});

module.exports = router;
