import React, { useState, useEffect } from "react";
import { getUserFollowedPostsAPI } from "../services/allAPI";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import SERVER_URL from "../services/serverUrl";
import { useNavigate } from "react-router-dom";

const FollowingFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card"); // card or compact
    const navigate=useNavigate()
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const reqHeader = { Authorization: `Bearer ${sessionStorage.getItem("token")}` };
      const response = await getUserFollowedPostsAPI(reqHeader);
      console.log("API Response:", response); // Debug log
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, likeCount: (post.likeCount || 0) + 1 } : post
      )
    );
    // Here you would also call the API to update the like
  };

  // Filter posts to only show those with images
  const getFilteredPosts = () => {
    return posts.filter((post) => post.blogImage);
  };

  const filteredPosts = getFilteredPosts();

  const handleViewPost = (id) => {
    navigate(`/blog/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Debug message for empty posts
  if (!posts || posts.length === 0) {
    console.log("No posts found in the response data");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header with title and view toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">People You Follow</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded ${viewMode === "card" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("compact")}
              className={`p-2 rounded ${viewMode === "compact" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* No posts message */}
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Follow more people to see their posts here or check your profile to see who you're following.</p>
          </div>
        )}

        {/* Posts grid or list */}
        <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
          {filteredPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                viewMode === "card" ? "border border-gray-200" : "flex items-center"
              }`}
            >
              {viewMode === "card" ? (
                // Card view
                <div>
                  {/* Author info */}
                  <div className="flex items-center p-4 border-b">
                    <div className="h-10 w-10 bg-gray-300 rounded-full overflow-hidden mr-3">
                      {/* Use username from the post or fallback since userId may not be populated */}
                      <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                        {post.username ? post.username.charAt(0).toUpperCase() : "U"}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{post.username || "Unknown User"}</h3>
                      <p className="text-xs text-gray-500">
                        {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Post title & category */}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h2>
                    <div className="flex items-center mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {post.category}
                      </span>
                    </div>
                    
                    {/* Post content preview */}
                    <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
                    
                    {/* Image (if available) */}
                    {post.blogImage && (
                      <div className="mb-4 rounded-md overflow-hidden">
                        <img
                          src={`${SERVER_URL}/uploads/${post.blogImage}`}
                          alt={post.title}
                          className="w-full h-56 object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Interaction stats */}
                    <div className="flex justify-between text-sm text-gray-500 mt-4">
                      <div className="flex space-x-4">
                        <button 
                          onClick={() => handleLike(post._id)}
                          className="flex items-center space-x-1 hover:text-blue-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes ? post.likes.length : (post.likeCount || 0)}</span>
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments ? post.comments.length : 0}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{post.viewCount || (post.views ? post.views.length : 0)}</span>
                        </div>
                      </div>
                      
                      <button className="text-blue-500 hover:underline" onClick={()=>handleViewPost(post._id)} >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Compact view
                <>
                  <div className="p-4 flex-grow">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 bg-gray-300 rounded-full overflow-hidden mr-2">
                        <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white">
                          {post.username ? post.username.charAt(0).toUpperCase() : "U"}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{post.username || "Unknown User"}</h3>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">
                            {post.createdAt && formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <h2 className="font-semibold text-gray-900">{post.title}</h2>
                    <p className="text-sm text-gray-700 line-clamp-1">{post.content}</p>
                  </div>
                  
                  {post.blogImage && (
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={`${SERVER_URL}/uploads/${post.blogImage}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowingFeed;