const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const auth = require('../middleware/auth');

router.post('/:postId', auth, async (req, res) => {
    try {
        const existing = await Like.findOne({ user: req.userId, post: req.params.postId });
        if (existing) return res.status(400).json({ message: 'Already liked' });
        const like = new Like({ user: req.userId, post: req.params.postId });
        await like.save();
        res.status(201).json({ message: 'Post liked' });
    } catch (err) {
        res.status(500).json({ message: 'Error liking post', error: err.message });
    }
});

router.delete('/:postId', auth, async (req, res) => {
    try {
        const like = await Like.findOneAndDelete({ user: req.userId, post: req.params.postId });
        if (!like) return res.status(404).json({ message: 'Like not found' });
        res.json({ message: 'Post unliked' });
    } catch (err) {
        res.status(500).json({ message: 'Error unliking post', error: err.message });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const count = await Like.countDocuments({ post: req.params.postId });
        res.json({ likes: count });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching likes', error: err.message });
    }
});

module.exports = router;