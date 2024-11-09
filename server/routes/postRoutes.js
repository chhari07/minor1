// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const Post = require('../mongodb/models/post');

// Create a new post
router.post('/', async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        const newPost = new Post({ title, description, imageUrl });
        await newPost.save();
        res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, message: 'Failed to create post' });
    }
});

// Fetch all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch posts' });
    }
});

module.exports = router;
