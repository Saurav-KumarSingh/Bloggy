import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});

  // Get logged-in userId from localStorage
  const loggedInUserId = localStorage.getItem("userId"); // store this at login

  // ✅ Fetch posts from backend
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
    fetchPosts();
  }, []);

  // 💬 Add comment with backend + update UI
  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/comment`,
        { postId, content: commentText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedComment = res.data;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [...p.comments, savedComment],
              }
            : p
        )
      );

      setNewComment({ ...newComment, [postId]: "" });
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment.");
    }
  };

  // 🗑 Delete comment (only own comment)
  const handleDeleteComment = async (postId, commentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/comment/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: p.comments.filter((c) => c.id !== commentId),
              }
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
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          ✨ Latest Posts
        </h1>

        <div className="space-y-12">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Image */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-72 object-cover"
                />
              )}

              {/* Post Info */}
              <div className="p-6 md:p-8">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                    {post.username ? post.username[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {post.username || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                  {post.title}
                </h2>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  {post.content}
                </p>

                {/* Comments */}
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    💬 Comments ({post.comments?.length || 0})
                  </h3>

                  <div className="space-y-3 mb-5">
                    {post.comments?.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                          {comment.username
                            ? comment.username[0].toUpperCase()
                            : "U"}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {comment.username}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {comment.content}
                          </p>
                        </div>

                        {/* Delete button for own comment */}
                        {comment.userId.toString() === loggedInUserId && (
                          <button
                            onClick={() =>
                              handleDeleteComment(post.id, comment.id)
                            }
                            className="ml-2 text-red-500 font-semibold hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <form
                    onSubmit={(e) => handleAddComment(post.id, e)}
                    className="flex flex-col gap-3"
                  >
                    <textarea
                      value={newComment[post.id] || ""}
                      onChange={(e) =>
                        setNewComment({
                          ...newComment,
                          [post.id]: e.target.value,
                        })
                      }
                      placeholder="Write a comment..."
                      rows="3"
                      className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                      type="submit"
                      className="self-end bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-transform"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
