const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const image = req.file ? req.file.path : null;
        const newPost = new Post({ title, content, author: req.userId, image });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: 'Error creating post', error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching post', error: err.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: 'Error updating post', error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Not authorized' });
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting post', error: err.message });
    }
});

module.exports = router;