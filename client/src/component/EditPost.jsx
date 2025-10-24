import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditPostPage() {
  const navigate = useNavigate();
  const { postId } = useParams(); 

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch post by ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const post = res.data;
        setFormData({
          title: post.title,
          content: post.content,
          image: post.imageUrl || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("❌ Failed to fetch post");
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/post/${postId}`,
        { title: formData.title, content: formData.content },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      alert("✅ Post updated successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("❌ Failed to update post");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading post...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          ✍️ Edit Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Preview */}
          {formData.image && (
            <div className="mb-4">
              <img
                src={formData.image}
                alt="Post"
                className="w-full object-cover rounded-lg"
                style={{ maxHeight: "600px", height: "auto" }}
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Post Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              rows="6"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
}
