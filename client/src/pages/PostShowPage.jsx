import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PostCard from "../component/PostCard";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId");

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (!loggedInUserId) {
      navigate("/");
      return;
    }
    fetchPosts();
  }, []);

  // Delete post function
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  // Comment functions
  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/comment`,
        { postId, content: commentText },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      const savedComment = res.data;
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, savedComment] } : p
        )
      );
      setNewComment({ ...newComment, [postId]: "" });
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
            : p
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold  mb-12 text-gray-900 sticky top-20 z-20">
          ✨ Latest Posts
        </h1>

        <div className="space-y-12">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              loggedInUserId={loggedInUserId}
              newComment={newComment}
              setNewComment={setNewComment}
              handleAddComment={handleAddComment}
              handleDeleteComment={handleDeleteComment}
              handleDeletePost={handleDeletePost} // pass delete post
            />
          ))}
        </div>
      </div>
    </div>
  );
}
