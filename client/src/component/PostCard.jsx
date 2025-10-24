import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function PostCard({
    post,
    loggedInUserId,
    newComment,
    setNewComment,
    handleAddComment,
    handleDeleteComment,
    handleDeletePost, // callback from parent
}) {
    const [commentsVisible, setCommentsVisible] = useState(false);
    const isOwner = post.userId.toString() === loggedInUserId;

    return (
        <article className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full object-cover rounded-t-2xl"
                    style={{ maxHeight: "600px", width: "100%", height: "auto" }}
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
                        <p className="font-semibold text-gray-800">{post.username || "Unknown"}</p>
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
                <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

                {/* Actions: Edit / Delete / Toggle Comments */}
                <div className="flex items-center gap-4 mb-4">
                    {isOwner && (
                        <>
                            <Link
                                to={`/edit-post/${post.id}`}
                                className="text-blue-600 font-medium hover:underline cursor-pointer"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-500 font-medium hover:underline cursor-pointer"
                            >
                                Delete
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setCommentsVisible(!commentsVisible)}
                        className="text-blue-600 font-medium hover:underline ml-auto"
                    >
                        {commentsVisible ? "Hide Comments" : `Comments (${post.comments?.length || 0})`}
                    </button>
                </div>

                {/* Comments Section */}
                {commentsVisible && (
                    <div className="border-t border-gray-200 pt-5">
                        <div className="space-y-3 mb-5">
                            {post.comments?.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex items-start gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl"
                                >
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                                        {comment.username ? comment.username[0].toUpperCase() : "U"}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{comment.username}</p>
                                        <p className="text-gray-600 text-sm">{comment.content}</p>
                                    </div>

                                    {handleDeleteComment && comment.userId.toString() === loggedInUserId && (
                                        <button
                                            onClick={() => handleDeleteComment(post.id, comment.id)}
                                            className="ml-2 text-red-500 font-semibold hover:underline"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Comment */}
                        {handleAddComment && (
                            <form
                                onSubmit={(e) => handleAddComment(post.id, e)}
                                className="flex flex-col gap-3"
                            >
                                <textarea
                                    value={newComment[post.id] || ""}
                                    onChange={(e) =>
                                        setNewComment({ ...newComment, [post.id]: e.target.value })
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
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
