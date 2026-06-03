import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Collapse,
  Divider,
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Favorite as LikedIcon,
  FavoriteBorder as LikeIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toggleLike, addComment, deleteComment, deletePost } from "../api";
import { useAuth } from "../context/AuthContext";

dayjs.extend(relativeTime);

export default function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [currentPost, setCurrentPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isLiked = currentPost.likes?.some(
    (l) => l.userId === user?._id || l.userId?._id === user?._id
  );
  const isOwner = currentPost.userId === user?._id || currentPost.userId?._id === user?._id;

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await toggleLike(currentPost._id);
      setCurrentPost((prev) => ({ ...prev, likes: res.data.likes }));
      if (onUpdate) onUpdate(currentPost._id, { likes: res.data.likes });
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      const res = await addComment(currentPost._id, commentText.trim());
      setCurrentPost((prev) => ({ ...prev, comments: res.data.comments }));
      setCommentText("");
      setShowComments(true);
      if (onUpdate) onUpdate(currentPost._id, { comments: res.data.comments });
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteComment(currentPost._id, commentId);
      setCurrentPost((prev) => ({ ...prev, comments: res.data.comments }));
      if (onUpdate) onUpdate(currentPost._id, { comments: res.data.comments });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (deleteLoading) return;
    setDeleteLoading(true);
    try {
      await deletePost(currentPost._id);
      if (onDelete) onDelete(currentPost._id);
    } catch (err) {
      console.error(err);
      setDeleteLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2.5, overflow: "visible" }}>
      <CardContent sx={{ pb: 1.5 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar sx={{ width: 42, height: 42 }}>
            {currentPost.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={600} fontSize="0.92rem" lineHeight={1.3}>
              @{currentPost.username}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "Space Mono, monospace" }}
            >
              {dayjs(currentPost.createdAt).fromNow()}
            </Typography>
          </Box>
          {isOwner && (
            <Tooltip title="Delete post">
              <IconButton
                size="small"
                onClick={handleDeletePost}
                disabled={deleteLoading}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "#f06292" },
                  opacity: 0.6,
                  "&:hover": { opacity: 1 },
                }}
              >
                {deleteLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <DeleteIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Post Text */}
        {currentPost.text && (
          <Typography
            variant="body1"
            sx={{ mb: currentPost.image ? 2 : 1.5, color: "#e0ddf0", lineHeight: 1.7 }}
          >
            {currentPost.text}
          </Typography>
        )}
      </CardContent>

      {/* Post Image */}
      {currentPost.image && (
        <CardMedia
          component="img"
          image={
            currentPost.image.startsWith("http")
              ? currentPost.image
              : `${process.env.REACT_APP_API_URL?.replace("/api", "") || "https://social-media-backend-cknm.onrender.com/"}${currentPost.image}`
          }
          alt="Post image"
          sx={{
            maxHeight: 440,
            objectFit: "cover",
            borderRadius: 0,
            mx: 0,
          }}
        />
      )}

      <CardContent sx={{ pt: 1.5 }}>
        {/* Action Bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Like */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={handleLike}
              disabled={likeLoading || !user}
              sx={{
                color: isLiked ? "#f06292" : "text.secondary",
                transition: "all 0.2s",
                "&:hover": { color: "#f06292", transform: "scale(1.15)" },
                "&:active": { transform: "scale(0.95)" },
              }}
            >
              {likeLoading ? (
                <CircularProgress size={18} />
              ) : isLiked ? (
                <LikedIcon fontSize="small" />
              ) : (
                <LikeIcon fontSize="small" />
              )}
            </IconButton>
            <Typography
              variant="body2"
              fontWeight={600}
              color={isLiked ? "#f06292" : "text.secondary"}
              sx={{ minWidth: 18, fontSize: "0.82rem" }}
            >
              {currentPost.likes?.length || 0}
            </Typography>
          </Box>

          {/* Comment toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 1 }}>
            <IconButton
              size="small"
              onClick={() => setShowComments((v) => !v)}
              sx={{
                color: showComments ? "primary.main" : "text.secondary",
                transition: "all 0.2s",
                "&:hover": { color: "primary.main" },
              }}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="body2"
              fontWeight={600}
              color={showComments ? "primary.main" : "text.secondary"}
              sx={{ fontSize: "0.82rem" }}
            >
              {currentPost.comments?.length || 0}
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Liked by */}
          {currentPost.likes?.length > 0 && (
            <Tooltip
              title={currentPost.likes.map((l) => `@${l.username}`).join(", ")}
              placement="top"
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ cursor: "default", fontFamily: "Space Mono, monospace" }}
              >
                {currentPost.likes.length === 1
                  ? `@${currentPost.likes[0].username} liked`
                  : `${currentPost.likes.length} likes`}
              </Typography>
            </Tooltip>
          )}
        </Box>

        {/* Comment Input */}
        {user && (
          <Box
            component="form"
            onSubmit={handleComment}
            sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "center" }}
          >
            <Avatar sx={{ width: 30, height: 30, fontSize: "0.7rem" }}>
              {user.username[0].toUpperCase()}
            </Avatar>
            <TextField
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment…"
              size="small"
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  background: "rgba(255,255,255,0.03)",
                },
              }}
              disabled={commentLoading}
            />
            <IconButton
              type="submit"
              size="small"
              disabled={!commentText.trim() || commentLoading}
              sx={{
                color: "primary.main",
                background: "rgba(124,106,247,0.15)",
                borderRadius: "10px",
                p: 1,
                "&:hover": { background: "rgba(124,106,247,0.3)" },
                "&.Mui-disabled": { opacity: 0.4 },
              }}
            >
              {commentLoading ? <CircularProgress size={16} /> : <SendIcon fontSize="small" />}
            </IconButton>
          </Box>
        )}

        {/* Comments List */}
        <Collapse in={showComments && currentPost.comments?.length > 0}>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 1.5 }} />
            {currentPost.comments?.map((c) => (
              <Box
                key={c._id}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.025)",
                  "&:hover .delete-btn": { opacity: 1 },
                }}
              >
                <Avatar sx={{ width: 28, height: 28, fontSize: "0.65rem" }}>
                  {c.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{ fontFamily: "Space Mono, monospace" }}
                    >
                      @{c.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontFamily: "Space Mono, monospace" }}
                    >
                      · {dayjs(c.createdAt).fromNow()}
                    </Typography>
                    {(c.userId === user?._id ||
                      c.userId?._id === user?._id) && (
                      <IconButton
                        size="small"
                        className="delete-btn"
                        onClick={() => handleDeleteComment(c._id)}
                        sx={{
                          opacity: 0,
                          p: 0.3,
                          color: "text.secondary",
                          transition: "opacity 0.2s",
                          "&:hover": { color: "#f06292" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.primary" lineHeight={1.5}>
                    {c.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
