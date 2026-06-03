const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");
const upload = require("../config/multer");

const router = express.Router();

// GET /api/posts - Get all posts (public feed), newest first
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error fetching posts." });
  }
});

// POST /api/posts - Create a new post (auth required)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { text } = req.body;
      const imageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : "";

      if (!text && !imageUrl) {
        return res
          .status(400)
          .json({ message: "Post must have either text or an image." });
      }

      const post = await Post.create({
        userId: req.user._id,
        username: req.user.username,
        text: text || "",
        image: imageUrl,
        likes: [],
        comments: [],
      });

      res.status(201).json({ message: "Post created!", post });
    } catch (error) {
      console.error("Create post error:", error);
      res.status(500).json({ message: "Server error creating post." });
    }
  }
);

// DELETE /api/posts/:id - Delete a post (owner only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post." });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted." });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error deleting post." });
  }
});

// POST /api/posts/:id/like - Toggle like on a post (auth required)
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some(
      (like) => like.userId.toString() === userId
    );

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (like) => like.userId.toString() !== userId
      );
    } else {
      // Like
      post.likes.push({ userId: req.user._id, username: req.user.username });
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked." : "Post liked.",
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error toggling like." });
  }
});

// POST /api/posts/:id/comment - Add a comment (auth required)
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const comment = {
      userId: req.user._id,
      username: req.user.username,
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: "Comment added!",
      comment: addedComment,
      comments: post.comments,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error adding comment." });
  }
});

// DELETE /api/posts/:id/comment/:commentId - Delete a comment (owner only)
router.delete("/:id/comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found." });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment." });
    }

    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    res.json({ message: "Comment deleted.", comments: post.comments });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error deleting comment." });
  }
});

module.exports = router;
