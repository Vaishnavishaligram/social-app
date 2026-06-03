import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Collapse,
  Tooltip,
} from "@mui/material";
import {
  Image as ImageIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { createPost } from "../api";
import { useAuth } from "../context/AuthContext";

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      setError("Please add some text or an image.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      if (text.trim()) fd.append("text", text.trim());
      if (image) fd.append("image", image);

      const res = await createPost(fd);
      setText("");
      removeImage();
      if (onPostCreated) onPostCreated(res.data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        background: "linear-gradient(135deg, rgba(124,106,247,0.06) 0%, rgba(240,98,146,0.04) 100%)",
        border: "1px solid rgba(124,106,247,0.2)",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 42, height: 42, mt: 0.5 }}>
            {user?.username[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={600} fontSize="0.88rem" color="text.secondary" mb={0.8}>
              What's on your mind, @{user?.username}?
            </Typography>
            <TextField
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
              placeholder="Share something with the world..."
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255,255,255,0.035)",
                  fontSize: "0.95rem",
                },
              }}
              disabled={loading}
            />
          </Box>
        </Box>

        {/* Image Preview */}
        <Collapse in={!!imagePreview}>
          <Box
            sx={{
              position: "relative",
              mt: 1.5,
              mb: 1.5,
              ml: { xs: 0, sm: 7 },
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid rgba(124,106,247,0.2)",
            }}
          >
            <img
              src={imagePreview}
              alt="preview"
              style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }}
            />
            <IconButton
              onClick={removeImage}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(13,13,26,0.8)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                "&:hover": { background: "rgba(240,98,146,0.8)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Collapse>

        {/* Error */}
        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 1.5, ml: { xs: 0, sm: 7 }, borderRadius: 2 }}>
            {error}
          </Alert>
        </Collapse>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ml: { xs: 0, sm: 7 },
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          <Tooltip title="Attach image">
            <IconButton
              onClick={() => fileRef.current?.click()}
              size="small"
              disabled={loading}
              sx={{
                color: image ? "primary.main" : "text.secondary",
                background: image ? "rgba(124,106,247,0.15)" : "transparent",
                borderRadius: 2,
                p: 1,
                "&:hover": { background: "rgba(124,106,247,0.15)", color: "primary.main" },
              }}
            >
              <ImageIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {image && (
            <Chip
              label={image.name.length > 20 ? image.name.slice(0, 20) + "…" : image.name}
              size="small"
              onDelete={removeImage}
              sx={{
                background: "rgba(124,106,247,0.15)",
                border: "1px solid rgba(124,106,247,0.25)",
                color: "text.secondary",
                fontSize: "0.72rem",
              }}
            />
          )}

          <Box sx={{ flex: 1 }} />

          <Typography
            variant="caption"
            color={text.length > 900 ? "error" : "text.secondary"}
            sx={{ fontFamily: "Space Mono, monospace" }}
          >
            {text.length}/1000
          </Typography>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || (!text.trim() && !image)}
            endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            size="small"
            sx={{
              background: "linear-gradient(135deg, #7c6af7 0%, #f06292 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #6a59e0 0%, #e0547f 100%)",
              },
              "&.Mui-disabled": { opacity: 0.5 },
            }}
          >
            {loading ? "Posting…" : "Post"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
