import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Collapse,
  Button,
  Divider,
  Fade,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";
import { getFeed } from "../api";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { useAuth } from "../context/AuthContext";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const res = await getFeed();
      setPosts(res.data.posts);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handlePostUpdated = (postId, updates) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, ...updates } : p))
    );
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background:
          "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(124,106,247,0.07) 0%, transparent 60%), #0d0d1a",
        pt: 3,
        pb: 8,
      }}
    >
      <Container maxWidth="sm" disableGutters sx={{ px: { xs: 1.5, sm: 0 } }}>
        {/* Page header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ fontFamily: "Space Mono, monospace" }}
            >
              Feed
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {posts.length > 0
                ? `${posts.length} post${posts.length !== 1 ? "s" : ""} — latest first`
                : "Be the first to post!"}
            </Typography>
          </Box>

          <Button
            size="small"
            startIcon={
              refreshing ? (
                <CircularProgress size={14} />
              ) : (
                <RefreshIcon fontSize="small" />
              )
            }
            onClick={() => loadPosts(true)}
            disabled={refreshing}
            sx={{
              color: "text.secondary",
              borderRadius: 2,
              "&:hover": { color: "primary.main", background: "rgba(124,106,247,0.1)" },
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Error state */}
        <Collapse in={!!error}>
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            action={
              <Button size="small" onClick={() => loadPosts()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Collapse>

        {/* Loading state */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress
                size={40}
                sx={{ color: "primary.main", mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Loading posts…
              </Typography>
            </Box>
          </Box>
        ) : posts.length === 0 ? (
          /* Empty state */
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              border: "1px dashed rgba(124,106,247,0.25)",
              borderRadius: 4,
              background: "rgba(124,106,247,0.03)",
            }}
          >
            <SparkleIcon sx={{ fontSize: 48, color: "primary.main", opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" fontWeight={600} mb={1}>
              No posts yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share something with the world!
            </Typography>
          </Box>
        ) : (
          /* Post list */
          posts.map((post) => (
            <Fade key={post._id} in timeout={300}>
              <div>
                <PostCard
                  post={post}
                  onDelete={handlePostDeleted}
                  onUpdate={handlePostUpdated}
                />
              </div>
            </Fade>
          ))
        )}
      </Container>
    </Box>
  );
}
