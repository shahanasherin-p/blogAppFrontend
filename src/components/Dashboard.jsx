import React, { useState, useEffect, useContext } from 'react';
import { 
  FileText, 
  Eye, 
  Heart,  
  Edit,
  Trash2,
  Plus,
  BarChart2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userAllBlogsAPI, deleteBlogAPI } from '../services/allAPI';
import { addProjectRespnseContext, editProjectResponseContext } from '../contexts/BlogContextApi';

const Dashboard = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Posts', value: '0', icon: FileText },
    { title: 'Views', value: '0', icon: Eye },
    { title: 'Likes', value: '0', icon: Heart },
  ]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get context values
  const { addProjectRespnse } = useContext(addProjectRespnseContext);
  const { editProjectResponse } = useContext(editProjectResponseContext);

  useEffect(() => {
    getUserPosts();
  }, [addProjectRespnse, editProjectResponse]); // Re-fetch posts when add or edit responses change

  const getUserPosts = async () => {
    setIsLoading(true);
    const token = sessionStorage.getItem("token");
    
    if (token) {
      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const result = await userAllBlogsAPI(reqHeader);

        if (result.status === 200) {
          const posts = result.data;
          setAllPosts(posts);
          
          // Calculate dashboard stats
          calculateDashboardStats(posts);
        }
      } catch (err) {
        console.log("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const calculateDashboardStats = (posts) => {
    if (!posts || posts.length === 0) return;

    // Calculate total posts
    const totalPosts = posts.length;
    
    // Calculate total views (assuming each post has a views property)
    const totalViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    
    // Calculate total likes (assuming each post has a likes property)
    const totalLikes = posts.reduce((sum, post) => sum + (post.likeCount || 0), 0);
    
    // Update stats
    setStats([
      { title: 'Posts', value: totalPosts.toString(), icon: FileText },
      { title: 'Views', value: totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'k' : totalViews.toString(), icon: Eye },
      { title: 'Likes', value: totalLikes >= 1000 ? (totalLikes / 1000).toFixed(1) + 'k' : totalLikes.toString(), icon: Heart },
    ]);
    
    // Calculate category percentages
    calculateCategoryStats(posts);
  };

  const calculateCategoryStats = (posts) => {
    // Count posts by category
    const categoryCounts = {};
    
    posts.forEach(post => {
      const category = post.category || 'uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Calculate percentages
    const totalPosts = posts.length;
    const categoryStats = Object.keys(categoryCounts).map(category => {
      const count = categoryCounts[category];
      const percentage = Math.round((count / totalPosts) * 100);
      
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
        percentage
      };
    });
    
    // Sort by percentage (highest first)
    categoryStats.sort((a, b) => b.percentage - a.percentage);
    
    setCategories(categoryStats);
  };

  // Function to handle post click
  const handlePostClick = (id) => {
    navigate(`/blog/${id}`);
  };

  // Function to handle post edit
  const handleEditPost = (id, e) => {
    e.stopPropagation(); // Prevent triggering the row click
    navigate(`/edit-post/${id}`);
  };

  // Function to handle post deletion
  const handleDeletePost = async (id, e) => {
    e.stopPropagation(); // Prevent triggering the row click
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      const token = sessionStorage.getItem("token");
      
      if (token) {
        const reqHeader = {
          Authorization: `Bearer ${token}`,
        };
        
        try {
          const result = await deleteBlogAPI(id, reqHeader);
          
          if (result.status === 200) {
            // Remove the deleted post from state
            setAllPosts(prevPosts => prevPosts.filter(post => post._id !== id));
            // Recalculate stats
            calculateDashboardStats(allPosts.filter(post => post._id !== id));
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

  // Calculate overall total views and likes for table footer
  const totalTableViews = allPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
  const totalTableLikes = allPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <Link to="/add-post">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Plus size={18} />
            New Post
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={20} className="text-gray-600" />
              <span className="text-sm text-gray-600">{stat.title}</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Posts Table */}
        <div className="md:col-span-2 bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900">Your Posts</h2>
            <BarChart2 size={20} className="text-gray-400" />
          </div>
          {isLoading ? (
            <p className="text-center py-4 text-gray-500">Loading posts...</p>
          ) : allPosts.length === 0 ? (
            <p className="text-center py-4 text-gray-500">You haven't created any posts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-600 border-b">
                    <th className="text-left py-3 font-medium">Title</th>
                    <th className="text-right py-3 font-medium">Views</th>
                    <th className="text-right py-3 font-medium">Likes</th>
                    <th className="text-right py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allPosts.map((post) => (
                    <tr 
                      key={post._id} 
                      className="text-sm cursor-pointer hover:bg-gray-50"
                      onClick={() => handlePostClick(post._id)}
                    >
                      <td className="py-3 text-gray-900">
                        {post.title}
                        {post.status && (
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            post.status === 'Published' 
                              ? 'bg-green-50 text-green-600' 
                              : 'bg-gray-50 text-gray-600'
                          }`}>
                            {post.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right text-gray-600">{post.viewCount || 0}</td>
                      <td className="py-3 text-right text-gray-600">{post.likeCount || 0}</td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => handleEditPost(post._id, e)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-red-600"
                            onClick={(e) => handleDeletePost(post._id, e)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="text-sm text-gray-600 border-t bg-gray-50 font-medium">
                    <td className="py-3 text-gray-900">Total</td>
                    <td className="py-3 text-right text-gray-900">
                      {totalTableViews >= 1000 ? (totalTableViews / 1000).toFixed(1) + 'k' : totalTableViews}
                    </td>
                    <td className="py-3 text-right text-gray-900">
                      {totalTableLikes >= 1000 ? (totalTableLikes / 1000).toFixed(1) + 'k' : totalTableLikes}
                    </td>
                    <td className="py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
          {isLoading ? (
            <p className="text-center py-4 text-gray-500">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No categories found.</p>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{category.name}</span>
                    <span className="text-gray-900">{category.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;