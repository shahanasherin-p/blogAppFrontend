import React, { useState, useEffect } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { 
  addCommentAPI, 
  getCommentsAPI, 
  deleteCommentAPI 
} from "../services/allAPI";
import { getCurrentUserId, getCurrentUsername, formatDate } from "../components/userUtils";

const CommentSection = ({ blogId, updateCommentCount }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // Fetch comments
  const fetchComments = async () => {
    const token = sessionStorage.getItem("token");
    console.log("Token for fetching comments:", token);
    
    try {
      // Pass token in the request header if available
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await getCommentsAPI(blogId, headers);
      
      if (response.status === 200) {
        const commentsArray = response.data.comments || [];
        const formattedComments = commentsArray.map(comment => ({
          _id: comment._id,
          userId: comment.user._id,
          author: comment.user.username,
          text: comment.text,
          createdAt: comment.createdAt
        }));
        
        setComments(formattedComments);
        updateCommentCount(formattedComments.length);
        console.log(`Successfully loaded ${formattedComments.length} comments`);
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
        setComments([]);
        updateCommentCount(0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Check for specific error types
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.status === 401) {
          console.warn("Authentication error when fetching comments");
          // Could handle token refresh or redirect to login here
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      }
      
      setComments([]);
      updateCommentCount(0);
    }
  };

  // Handle adding a comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      setSubmittingComment(true);
      const token = sessionStorage.getItem("token");
      console.log("Token retrieved while adding comment:", token); 
      if (!token) {
        alert("Please log in to comment");
        setSubmittingComment(false);
        return;
      }

      // Get current user ID
      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        console.error("Failed to get user ID from session storage");
        console.log("Session storage content:", {
          token: sessionStorage.getItem("token"),
          existingUser: sessionStorage.getItem("existingUser")
        });
        
        alert("Unable to retrieve user information. Please try logging out and logging in again.");
        setSubmittingComment(false);
        return;
      }
      
      const reqHeader = { Authorization: `Bearer ${token}` };
      const commentData = {
        text: commentText,
        author: getCurrentUsername(),
        user: currentUserId
      };
      
      console.log("Sending comment data:", commentData);
      
      const response = await addCommentAPI(blogId, commentData, reqHeader);
      console.log("Comment API response:", response);
      
      if (response.status === 200 || response.status === 201) {
        // Safely handle the response data
        const responseData = response.data || {};
        
        // Create a new comment object with fallbacks for all properties
        const newComment = {
          _id: responseData._id || `temp-${Date.now()}`, // Use a temporary ID if none exists
          userId: responseData.user || currentUserId,
          author: responseData.author || getCurrentUsername(),
          text: responseData.text || commentText,
          createdAt: responseData.createdAt || new Date().toISOString()
        };
        
        console.log("Adding new comment to UI:", newComment);
        
        const updatedComments = [newComment, ...comments];
        setComments(updatedComments);
        setCommentText("");
        updateCommentCount(updatedComments.length);
      } else {
        alert(`Failed to add comment. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(`Failed to add comment: ${error.message || "Unknown error"}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    if (!commentId) {
      console.error("Cannot delete comment: commentId is undefined");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("Please log in to delete comments");
        return;
      }

      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await deleteCommentAPI(blogId, commentId, reqHeader);
      
      if (response.status === 200) {
        // Remove the deleted comment from state
        const updatedComments = comments.filter(comment => comment._id !== commentId);
        setComments(updatedComments);
        updateCommentCount(updatedComments.length);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  return (
    <div className="pt-2">
      <h3 className="text-2xl font-semibold mb-5 flex items-center gap-2">
        <MessageCircle size={22} />
        Comments
      </h3>
      
      <CommentForm 
        commentText={commentText}
        setCommentText={setCommentText}
        submittingComment={submittingComment}
        handleAddComment={handleAddComment}
      />

      <CommentList 
        comments={comments} 
        handleDeleteComment={handleDeleteComment}
      />
    </div>
  );
};

// Comment Form Component
const CommentForm = ({ commentText, setCommentText, submittingComment, handleAddComment }) => {
  return (
    <div className="mb-6">
      <textarea
        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
        rows={3}
        placeholder="Share your thoughts on this post..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      ></textarea>
      
      <div className="flex justify-end mt-3">
        <button 
          className={`px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2
            ${submittingComment ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={submittingComment || !commentText.trim()}
          onClick={handleAddComment}
        >
          {submittingComment ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Posting...
            </>
          ) : (
            'Post Comment'
          )}
        </button>
      </div>
    </div>
  );
};

// Comment List Component
const CommentList = ({ comments, handleDeleteComment }) => {
  return (
    <>
      {Array.isArray(comments) && comments.length > 0 ? (
        <div className="space-y-5">
          {comments.map((comment) => {
            const isAuthor = comment.userId === getCurrentUserId();
            return (
              <div key={comment._id || Math.random().toString()} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-gray-800 mb-1">{comment.author || "Anonymous"}</div>
                  {isAuthor && (
                    <button 
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      title="Delete comment"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mb-2">{comment.text}</p>
                <div className="text-gray-400 text-sm">{formatDate(comment.createdAt)}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500 mb-2">No comments yet.</p>
          <p className="text-gray-600 font-medium">Be the first to share your thoughts!</p>
        </div>
      )}
    </>
  );
};

export default CommentSection;