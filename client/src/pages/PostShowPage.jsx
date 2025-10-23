import React, { useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Designing with React & Tailwind CSS",
      author: "John Doe",
      avatar: "https://i.pravatar.cc/100?img=3",
      date: "October 23, 2025",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      content:
        "React paired with Tailwind CSS gives you the freedom to create modern, sleek interfaces effortlessly. Here's how to make your next UI shine.",
      comments: [
        { id: 1, author: "Alice", text: "This looks so clean! 😍" },
        { id: 2, author: "Bob", text: "Tailwind is my go-to now!" },
      ],
    },
    {
      id: 2,
      title: "The Power of Component Reusability",
      author: "Jane Smith",
      avatar: "https://i.pravatar.cc/100?img=5",
      date: "October 20, 2025",
      image:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200&q=80",
      content:
        "Reusable components make your React app scalable and maintainable. Learn how to create smart, reusable building blocks in your projects.",
      comments: [{ id: 1, author: "Charlie", text: "Great advice 👏" }],
    },
  ]);

  const [newComment, setNewComment] = useState({});

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    if (!newComment[postId]?.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: p.comments.length + 1,
                  author: "You",
                  text: newComment[postId],
                },
              ],
            }
          : p
      )
    );
    setNewComment({ ...newComment, [postId]: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          ✨ Modern Posts Feed
        </h1>

        <div className="space-y-12">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-72 object-cover"
                />
              )}

              {/* Post Info */}
              <div className="p-6 md:p-8">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{post.author}</p>
                    <p className="text-sm text-gray-500">{post.date}</p>
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
                    💬 Comments ({post.comments.length})
                  </h3>

                  <div className="space-y-3 mb-5">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl"
                      >
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                          {comment.author[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {comment.author}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {comment.text}
                          </p>
                        </div>
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
