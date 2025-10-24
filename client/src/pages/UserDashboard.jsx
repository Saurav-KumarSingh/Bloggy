import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PostCard from "../component/PostCard";

export default function UserDashboard() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  // Fetch user's posts
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/my-posts`, {
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

  // Add comment
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

  // Delete comment
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

  // Delete post
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="px-16 mx-auto flex flex-col md:flex-row gap-8">
        {/* Left column: User Info */}
        <div className="md:w-1/4 h-[85vh] bg-white shadow-md rounded-xl p-6 flex flex-col items-center sticky top-20">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold uppercase mb-4">
            {username?.[0]}
          </div>
          <h2 className="text-xl font-bold mb-1 text-center">{username}</h2>
          <p className="text-gray-600 text-center">{email}</p>
        </div>

        {/* Right column: User Posts */}
        <div className="md:w-3/4 flex flex-col gap-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Posts ({posts.length})
          </h3>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                loggedInUserId={loggedInUserId}
                newComment={newComment}
                setNewComment={setNewComment}
                handleAddComment={handleAddComment}
                handleDeleteComment={handleDeleteComment}
                handleDeletePost={handleDeletePost}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
