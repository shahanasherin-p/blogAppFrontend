import React, { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { deleteBlogAPI, allBlogsAPI } from '../services/allAPI';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const PostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("token");
        const reqHeader = { "Authorization": "Bearer " + token };
        const response = await allBlogsAPI(reqHeader);
        if (response?.status === 200 && response?.data) {
          setPosts(response.data);
        } else {
          setError("Failed to fetch posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || err.message || "An error occurred while fetching posts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      const token = sessionStorage.getItem("token");
      if (token) {
        const reqHeader = { Authorization: `Bearer ${token}` };
        try {
          const result = await deleteBlogAPI(id, reqHeader);
          if (result.status === 200) {
            setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
            alert('Post deleted successfully');
          } else {
            alert('Failed to delete post');
          }
        } catch (err) {
          console.log("Delete Error:", err);
          alert('Error deleting post');
        }
      }
    }
  };

  const handleViewPost = (id, e) => {
    if (e) e.stopPropagation();
    navigate(`/blog/${id}`);
  };

  // Render card view for mobile
  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow text-center text-gray-500">
            No posts found
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post._id} 
              className="bg-white p-4 rounded-md shadow"
              onClick={() => handleViewPost(post._id)}
            >
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Title</span>
                  <p className="font-medium">{post.title}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Author</span>
                    <p className="text-sm">{post?.username || post.author || "Unknown"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Date</span>
                    <p className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-500 uppercase">ID</span>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{post._id}</p>
                </div>
                <div className="flex justify-end gap-4 mt-3">
                  <button 
                    className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-md text-sm"
                    onClick={(e) => handleViewPost(post._id, e)}
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm"
                    onClick={(e) => handleDeletePost(post._id, e)}
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr 
                key={post._id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewPost(post._id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">{post._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post?.username || post.author || "Unknown"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button 
                      className="text-green-600 hover:text-green-800" 
                      onClick={(e) => handleViewPost(post._id, e)}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800" 
                      onClick={(e) => handleDeletePost(post._id, e)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
        <h1 className="text-2xl font-bold mb-6">All Posts</h1>
        
        {isLoading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          isMobile ? renderMobileView() : renderDesktopView()
        )}
      </div>
    </div>
  );
};

export default PostsManagement;