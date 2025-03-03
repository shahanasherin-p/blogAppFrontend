// PostDetails.jsx - Main component
import React, { useState, useEffect, useContext } from "react";
import { ThumbsUp, Share2, MessageCircle, Eye, UserPlus, UserMinus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  singleBlogsAPI,
  likePostAPI, 
  viewPostAPI,
  followUserAPI,
  unfollowUserAPI,
  userProfileAPI
} from "../services/allAPI";
import SERVER_URL from "../services/serverUrl";
import { 
  likePostResponseContext, 
  viewPostResponseContext,
  followUserResponseContext, 
  unfollowUserResponseContext 
} from "../contexts/BlogContextApi";
import CommentSection from "../components/CommentSection";
import { formatDate, getCurrentUserId, getCurrentUsername } from "../components/userUtils";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const validBlogId = id.startsWith(":") ? id.substring(1) : id;
  const [blog, setBlog] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  
  // Context states
  const { likePostResponse, setLikePostResponse } = useContext(likePostResponseContext);
  const { viewPostResponse, setViewPostResponse } = useContext(viewPostResponseContext);
  const { followUserResponse, setFollowUserResponse } = useContext(followUserResponseContext);
  const { unfollowUserResponse, setUnfollowUserResponse } = useContext(unfollowUserResponseContext);
  
  // Check token availability
  const checkAuth = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      // Redirect to login if not logged in
      alert("Please log in to view this post");
      navigate("/login");
      return null;
    }
    return token;
  };
  
  // Check if current user has already liked the post
  const checkIfLiked = (blogData) => {
    const userId = getCurrentUserId();
    if (userId && blogData.likes && Array.isArray(blogData.likes)) {
      return blogData.likes.includes(userId);
    }
    return false;
  };

  // Check if current user has already viewed the post
  const checkIfViewed = (blogData) => {
    const userId = getCurrentUserId();
    if (userId && blogData.views && Array.isArray(blogData.views)) {
      return blogData.views.includes(userId);
    }
    return false;
  };


  const fetchCurrentUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return null;
      
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await userProfileAPI(reqHeader);
      
      if (response.status === 200) {
        setCurrentUser(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchCurrentUser();
  }, []);




  // Add this useEffect at the beginning of your component
  useEffect(() => {
      const checkIfFollowing = () => {
    if (!currentUser || !blog || !blog.userId) return false;
    
    return currentUser.following && 
           Array.isArray(currentUser.following) && 
           currentUser.following.includes(blog.userId);
  };
    
    // Only check if we have a valid blog and userId
    if (blog && blog.userId) {
      checkIfFollowing();
    }
  }, [blog]); // Re-run when blog changes

  // Update your fetchBlogDetails function to include following check
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const token = checkAuth();
        if (!token) {
          setLoading(false);
          return;
        }

        const reqHeader = { Authorization: `Bearer ${token}` };
        const response = await singleBlogsAPI(validBlogId, reqHeader);

        if (response.status === 200) {
          setBlog(response.data);
          setHasLiked(checkIfLiked(response.data));
          setHasViewed(checkIfViewed(response.data));
          
          // Check if user is following the blog author
          if (response.data.userId) {
            // Get current user data directly here
            const currentUser = JSON.parse(sessionStorage.getItem("users") || "{}");
            const isUserFollowed = currentUser?.following?.includes(response.data.userId) || false;
            console.log("Initial following status:", isUserFollowed, "for user ID:", response.data.userId);
            setIsFollowing(isUserFollowed);
          }
          
          // Only record view if user hasn't viewed yet
          if (!checkIfViewed(response.data)) {
            handleViewPost(validBlogId, reqHeader);
          }
        } else {
          setError("Failed to load blog post.");
        }
      } catch (err) {
        setError("Failed to load blog post.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (validBlogId) fetchBlogDetails();
  }, [validBlogId, navigate]);

  // Remove or modify this useEffect since it's now redundant
  // Only keep it if you need to react to blog changes after the initial load

  // Handle view post - only if user hasn't viewed yet
  const handleViewPost = async (postId, reqHeader) => {
    if (hasViewed) {
      // User already viewed this post, don't increment again
      return;
    }
    
    try {
      const response = await viewPostAPI(postId, reqHeader);
      
      if (response.status === 200) {
        setViewPostResponse(response.data);
        setHasViewed(true);
        
        // Update blog state with new view count
        setBlog(prev => ({
          ...prev, 
          viewCount: response.data.views,
          views: response.data.viewedBy
        }));
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  // Handle like post - toggle like
  const handleLikePost = async () => {
    try {
      const token = checkAuth();
      if (!token) return;

      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await likePostAPI(validBlogId, reqHeader);
      
      if (response.status === 200) {
        setLikePostResponse(response.data);
        
        // Toggle like state
        const newLikeState = !hasLiked;
        setHasLiked(newLikeState);
        
        // Update blog with new like count and likes array
        setBlog(prev => ({
          ...prev, 
          likeCount: response.data.likes,
          likes: response.data.likedBy
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handle follow/unfollow user
  const handleFollowToggle = async () => {
    try {
      console.log("Follow toggle clicked. Current status:", isFollowing);
      const token = checkAuth();
      if (!token) return;

      const reqHeader = { Authorization: `Bearer ${token}` };
      let response;

      if (isFollowing) {
        // Unfollow user
        response = await unfollowUserAPI(blog.userId, reqHeader);
        if (response.status === 200) {
          setUnfollowUserResponse(response.data);
          setIsFollowing(false);
          
          // Update user in session storage to reflect the change
          const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
          if (currentUser && currentUser.following) {
            currentUser.following = currentUser.following.filter(id => id !== blog.userId);
            sessionStorage.setItem("user", JSON.stringify(currentUser));
          }
        }
      } else {
        // Follow user
        response = await followUserAPI(blog.userId, reqHeader);
        if (response.status === 200) {
          setFollowUserResponse(response.data);
          setIsFollowing(true);
          
          // Update user in session storage to reflect the change
          const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
          if (currentUser) {
            if (!currentUser.following) {
              currentUser.following = [];
            }
            if (!currentUser.following.includes(blog.userId)) {
              currentUser.following.push(blog.userId);
              sessionStorage.setItem("user", JSON.stringify(currentUser));
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, error);
    }
  };

  // Update comment count in blog state
  const updateCommentCount = (count) => {
    if (blog && blog.commentCount !== undefined) {
      setBlog(prev => ({
        ...prev,
        commentCount: count
      }));
    }
  };

  const renderFormattedContent = (content) => {
    if (!content) return null;
    
    // Split the content by line breaks and map each line to a paragraph or list item
    return content.split('\n').map((line, index) => {
      // Check if the line starts with a bullet point character
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <li key={index} className="ml-5 mb-2">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      
      // Otherwise, render as a paragraph with bottom margin
      return line.trim() ? (
        <p key={index} className="mb-4">
          {line}
        </p>
      ) : (
        // Empty lines still need a key but can be smaller spacers
        <div key={index} className="h-2"></div>
      );
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center py-10">
        <div className="text-red-500 text-xl mb-2">⚠️ {error}</div>
        <p className="text-gray-600">Please try again or contact support if the problem persists.</p>
      </div>
    </div>
  );
  
  if (!blog) return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center py-10 text-gray-500">
        <p className="text-xl">Blog post not found</p>
        <p className="mt-2">The post you're looking for might have been removed or is no longer available.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-6">
      {/* Post Header */}
      <BlogHeader 
        blog={blog} 
        isFollowing={isFollowing} 
        handleFollowToggle={handleFollowToggle} 
      />

      {/* Blog Image */}
      {blog.blogImage && (
        <div className="mb-6">
          <img
            src={blog?.blogImage}
            alt={blog?.title}
            className="w-full h-[350px] object-cover rounded-xl shadow-md"
            onError={(e) => { e.target.src = `${SERVER_URL}/uploads/${blog?.blogImage}`; }}
          />
        </div>
      )}

      {/* Post Content */}
      <div className="prose max-w-none text-lg leading-relaxed mb-8 text-gray-700">
      {renderFormattedContent(blog.content)}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-8 py-3 border-t border-b">
        <div className="flex gap-6">
          <button 
            onClick={handleLikePost}
            className={`flex items-center gap-2 transition ${hasLiked ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
          >
            <ThumbsUp size={20} className={hasLiked ? 'fill-blue-600' : ''} />
            <span className="font-semibold">{blog?.likeCount || 0}</span>
          </button>
          
          <div className="flex items-center gap-2 text-gray-700">
            <MessageCircle size={20} />
            <span className="font-semibold">{blog?.comments.length || 0}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <Eye size={20} />
            <span className="font-semibold">{blog?.viewCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection 
        blogId={validBlogId} 
        updateCommentCount={updateCommentCount} 
      />
    </div>
  );
};

// BlogHeader Component
const BlogHeader = ({ blog, isFollowing, handleFollowToggle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-extrabold mb-3 text-gray-800">{blog.title || "Untitled Post"}</h1>
      <div className="flex items-center justify-between text-gray-600 text-sm">
        <p>By <span className="font-semibold">{blog?.username || "Anonymous"}</span> • {formatDate(blog.createdAt)}</p>
        
        {blog.userId && blog.userId !== getCurrentUserId() && (
          <button 
            onClick={handleFollowToggle}
            className={`px-4 py-1.5 border rounded-full text-sm flex items-center gap-1.5 transition-colors
              ${isFollowing 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                : 'border-blue-500 text-blue-600 hover:bg-blue-50'}`}
          >
            {isFollowing ? (
              <>
                <UserMinus size={16} /> Unfollow
              </>
            ) : (
              <>
                <UserPlus size={16} /> Follow
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostDetails;