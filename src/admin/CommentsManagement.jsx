import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { getAllCommentsAPI, deleteCommentAPI } from '../services/allAPI';
import Sidebar from './Sidebar';

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        const reqHeader = { "Authorization": "Bearer " + token };
        const response = await getAllCommentsAPI(reqHeader);
        if (response?.status === 200 && response?.data) {
          setComments(response.data);
        } else {
          setError("Failed to fetch comments");
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(err.response?.data?.message || err.message || "An error occurred while fetching comments");
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleDeleteComment = async (postId, commentId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this comment?')) {
      const token = sessionStorage.getItem("token");
      if (token) {
        const reqHeader = { Authorization: `Bearer ${token}` };
        try {
          const result = await deleteCommentAPI(postId, commentId, reqHeader);
          if (result.status === 200) {
            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
            alert('Comment deleted successfully');
          } else {
            alert('Failed to delete comment');
          }
        } catch (err) {
          console.log("Delete Error:", err);
          alert('Error deleting comment');
        }
      }
    }
  };

  // Render card view for mobile
  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow text-center text-gray-500">
            No comments found
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded-md shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-full">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Comment</span>
                    <p className="text-sm">{comment.content || comment.text}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">User</span>
                      <p className="text-sm">{comment?.user || "Anonymous"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Post</span>
                      <p className="text-sm">{comment.postTitle || "Unknown Post"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 uppercase">Date</span>
                      <p className="text-sm">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                  </div>
                </div>
                <button 
                  className="text-red-600 hover:text-red-800 p-2 ml-2 flex-shrink-0" 
                  onClick={(e) => handleDeleteComment(comment.postId, comment._id, e)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // Render table for desktop
  const renderDesktopView = () => {
    return (
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Post Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.map((comment) => (
              <tr key={comment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{comment?.user || "Anonymous"}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{comment.content || comment.text}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{comment.postTitle || "Unknown Post"}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Unknown"}</td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-800" onClick={(e) => handleDeleteComment(comment.postId, comment._id, e)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="md:w-64 w-full">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 overflow-x-hidden">
        <h1 className="text-2xl font-bold mb-6">Comments Management</h1>
        
        {isLoading ? (
          <div className="text-center py-8">Loading comments...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          isMobile ? renderMobileView() : renderDesktopView()
        )}
      </div>
    </div>
  );
};

export default CommentsManagement;