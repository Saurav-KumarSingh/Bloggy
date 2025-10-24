import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    imageFile: null,
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
        imageFile: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log(token)

      const postJson = {
        title: formData.title,
        content: formData.content,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("post", JSON.stringify(postJson));
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/upload`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Post created successfully!");
      console.log(res.data);

      navigate("/home")

      setFormData({
        title: "",
        image: "",
        imageFile: null,
        content: "",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      alert("❌ Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {/* CREATE FORM */}
        <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            ✍️ Create a New Post
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg p-2"
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
              Publish Post
            </button>
          </form>
        </div>

        {/* LIVE PREVIEW */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🪄 Live Preview
            </h2>
            {formData.title || formData.content || formData.image ? (
              <div className="border-t border-gray-200 pt-4">
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-56 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {formData.title || "Post title"}
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {formData.content || "Your post content will appear here..."}
                </p>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-10">
                🖊️ Start typing to see a live preview here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
