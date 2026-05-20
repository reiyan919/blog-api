const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

router.post('/:postId', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const newComment = new Comment({ content, author: req.userId, post: req.params.postId });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: 'Error creating comment', error: err.message });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching comments', error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        if (comment.author.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting comment', error: err.message });
    }
});

module.exports = router;