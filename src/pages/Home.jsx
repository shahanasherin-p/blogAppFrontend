import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, ChevronRight, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHomeProjectApi, getHomeUserApi, getPostscategoryApi } from '../services/allAPI';
import SERVER_URL from '../services/serverUrl';

const Home = () => {
  const navigate = useNavigate();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [popularAuthors, setPopularAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [postsResponse, usersResponse, categoriesResponse] = await Promise.all([
          getHomeProjectApi(), 
          getHomeUserApi(),
          getPostscategoryApi()
        ]);
        
        // Limit to 9 posts for the recent posts section
        setFeaturedPosts(postsResponse.data?.slice(0, 10) || []);
        setPopularAuthors(usersResponse.data || []);
        
        // Format category data from the corrected API response format
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          const formattedCategories = categoriesResponse.data.map(category => {
            // Map category names to emoji icons
            const getIconForCategory = (categoryName) => {
              const iconMap = {
                'Technology': '💻',
                'Travel': '✈️',
                'Food': '🍕',
                'Lifestyle': '🌿',
                'Health': '🧘',
                'Business': '📊',
                'Art': '🎨',
                'Science': '🔬',
                // Add additional mappings as needed
              };
              return iconMap[categoryName] || '📝'; // Default icon if category not found
            };
            
            return {
              name: category._id, // Category name is in _id field
              posts: category.count, // Post count is in count field
              icon: getIconForCategory(category._id)
            };
          });
          
          setCategories(formattedCategories);
        } else {
          // Fallback to default categories if API doesn't return data
          setCategories([
            { name: 'Technology', posts: 0, icon: '💻' },
            { name: 'Travel', posts: 0, icon: '✈️' },
            { name: 'Food', posts: 0, icon: '🍕' },
            { name: 'Lifestyle', posts: 0, icon: '🌿' },
            { name: 'Health', posts: 0, icon: '🧘' },
            { name: 'Business', posts: 0, icon: '📊' },
            { name: 'Art', posts: 0, icon: '🎨' },
            { name: 'Science', posts: 0, icon: '🔬' }
          ]);
        }
        
        // Check if user is authenticated
        const token = sessionStorage.getItem('token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error fetching home data:", error);
        // Set default categories in case of error
        setCategories([
          { name: 'Technology', posts: 0, icon: '💻' },
          { name: 'Travel', posts: 0, icon: '✈️' },
          { name: 'Food', posts: 0, icon: '🍕' },
          { name: 'Lifestyle', posts: 0, icon: '🌿' },
          { name: 'Health', posts: 0, icon: '🧘' },
          { name: 'Business', posts: 0, icon: '📊' },
          { name: 'Art', posts: 0, icon: '🎨' },
          { name: 'Science', posts: 0, icon: '🔬' }
        ]);
      }
    };

    fetchHomeData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const handleViewAllClick = () => {
    if (isAuthenticated) {
      navigate('/allBlogs');
    } else {
      // Show a modal or alert
      alert('Please register to view all posts');
      navigate('/register');
    }
  };

  // New function to handle clicking on a post
  const handlePostClick = (postId) => {
    if (isAuthenticated) {
      navigate(`/blog/${postId}`);
    } else {
      alert('Please register to view this post');
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
            variants={itemVariants}
          >
            <span className="block text-gray-900">Where good ideas</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mt-2 block">find you</span>
          </motion.h1>
          <motion.p 
            className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500"
            variants={itemVariants}
          >
            Discover stories, thinking, and expertise from writers on any topic that matters to you.
          </motion.p>
          
          {/* Trending Topics */}
          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-2"
            variants={itemVariants}
          >
            <span className="text-sm text-gray-500 py-2">Trending:</span>
            {['Technology', 'Writing', 'Data Science', 'Politics'].map((topic) => (
              <motion.button
                key={topic}
                className="px-4 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "#3B82F6", 
                  color: "#FFFFFF" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                {topic}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Posts Section  */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
          </div>
          <motion.button 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            whileHover={{ x: 5 }}
            onClick={handleViewAllClick}
          >
            View all
            <ChevronRight className="h-4 w-4 ml-1" />
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featuredPosts.map((post, index) => (
            <motion.div
              key={index}
              className="relative h-80 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => handlePostClick(post._id)}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredPost(index)}
              onHoverEnd={() => setHoveredPost(null)}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition-all duration-300" />
              <motion.div 
                className="absolute inset-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={`${SERVER_URL}/uploads/${post.blogImage}`}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </motion.div>
              
              {/* Always visible content */}
              <div className="absolute bottom-0 p-6 text-white z-10">
                <div className="mb-32">
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">{post.category}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-300 transition-colors">{post.title}</h3>
                
                {/* User info */}
                <div className="flex items-center mt-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 mr-3 flex items-center justify-center text-sm font-bold text-white">
                    {post.username.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{post.username}</p>
                    <p className="text-xs opacity-80">{post.readTime}</p>
                  </div>
                </div>
              </div>
              
              {/* Content that appears on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 p-6 flex flex-col justify-center"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: hoveredPost === index ? 1 : 0,
                  transition: { duration: 0.3 }
                }}
              >
                <p className="text-sm text-gray-300 line-clamp-3">{post.content}</p>
              </motion.div>
              
              <motion.div 
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ rotate: 180, backgroundColor: "#3B82F6" }}
              >
                <ArrowRight className="h-4 w-4 text-white" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Popular Authors Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Popular Authors</h2>
            </div>
          </motion.div>
          
          <motion.div 
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {popularAuthors.map((author, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center space-y-4 p-5 rounded-xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                style={{ cursor: 'pointer' }}
              >
                {author.profileImage ? (
                  <img
                    src={`${SERVER_URL}/uploads/${author.profileImage}`}
                    alt={author.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                    {author.username}
                  </h3>
                  <div className="flex items-center justify-center mt-2 space-x-2">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                      {author.bio || "Awaiting Bio Update"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Categories Section with Dynamic Data */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              className="p-6 text-center rounded-xl bg-white shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
              }}
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <p className="font-medium text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-500 mt-1">{category.posts} posts</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;