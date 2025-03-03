import React, { useState, useEffect, useContext } from 'react';
import { Eye, Heart, Tags, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { allBlogsAPI } from '../services/allAPI';
import SERVER_URL from '../services/serverUrl';
import { useNavigate } from 'react-router-dom';
import { viewPostResponseContext, likePostResponseContext } from '../contexts/BlogContextApi';

const BlogsCollection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [allPosts, setAllPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { viewPostResponse } = useContext(viewPostResponseContext);
  const { likePostResponse } = useContext(likePostResponseContext);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Change as per requirement


  const categories = [
    { name: 'All', color: 'bg-gray-100' },
    { name: 'Technology', color: 'bg-rose-50' },
    { name: 'Travel', color: 'bg-blue-50' },
    { name: 'Food', color: 'bg-green-50' },
    { name: 'Lifestyle', color: 'bg-purple-50' },
    { name: 'Health', color: 'bg-orange-50' },
    { name: 'Business', color: 'bg-cyan-50' },
    { name: 'Art', color: 'bg-green-50' },
    { name: 'Science', color: 'bg-red-50' }
  ];

  // Function to fetch all posts from API
  const getAllPosts = async () => {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      return;
    }

    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await allBlogsAPI(reqHeader);

      if (result.status === 200) {
        setAllPosts(result.data);
        const uniqueCats = [...new Set(result.data.map(post => post.category))];
        setAvailableCategories(uniqueCats);
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  // Navigate to blog details page
  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  // Call getAllPosts on component mount and get username from sessionStorage
  useEffect(() => {
    getAllPosts();
    
    // Try to get username from session storage
    const storedUsername = sessionStorage.getItem("username");
    
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const userString = sessionStorage.getItem("user");
      if (userString) {
        try {
          const userObj = JSON.parse(userString);
          if (userObj.username) {
            setUsername(userObj.username);
            sessionStorage.setItem("username", userObj.username);
          }
        } catch (err) {
          console.log("Error parsing user object:", err);
        }
      }
    }
  }, [viewPostResponse, likePostResponse]);

  const formatNumber = (num) => {
    if (!num) return 0;
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };

  // Filter blogs by category and search query
  const filteredBlogs = allPosts
    .filter(blog => {
      // Category filter
      const categoryMatch = selectedCategory === 'All' || 
        (blog.category && blog.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      
      // Search filter
      const searchMatch = !searchQuery || 
        (blog.title && blog.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.username && blog.username.toLowerCase().includes(searchQuery.toLowerCase()));
      return categoryMatch && searchMatch;
    });

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
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Animated Gradient Background */}
      <motion.section 
        className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Blob Shapes */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-white opacity-20"
            style={{ top: '-10%', left: '20%' }}
            animate={{ 
              x: [0, 30, 0], 
              y: [0, -30, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-white opacity-20"
            style={{ bottom: '-20%', right: '10%' }}
            animate={{ 
              x: [0, -40, 0], 
              y: [0, 20, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "easeInOut",
              delay: 2 
            }}
          />
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-center justify-between px-8 py-16">
          <motion.div 
            className="md:w-1/2 text-white z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Explore the Latest in 
              <motion.span 
                className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                Tech & Design
              </motion.span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-lg">
              Stay updated with insightful articles on development, design, and emerging trends in technology.
            </p>
            <div className="flex gap-4">
              <motion.button 
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Reading
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Topics
              </motion.button>
            </div>
          </motion.div>
          
          {/* Animated Illustration */}
          <motion.div 
            className="md:w-1/2 mt-8 md:mt-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <svg viewBox="0 0 800 400" className="w-full max-w-lg mx-auto">
              {/* Background shapes */}
              <motion.path 
                d="M680 300c-40 20-80-30-120-10s-60 40-100 30-80-40-120-30-60 30-100 20-80-40-120-20-60 40-100 30" 
                fill="none" 
                stroke="rgba(255,255,255,0.2)" 
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              
              {/* Floating document shapes */}
              <motion.g 
                transform="translate(500,180)"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <rect x="0" y="0" width="140" height="160" rx="10" fill="white" opacity="0.9"/>
                <rect x="20" y="20" width="100" height="10" rx="5" fill="#818cf8"/>
                <rect x="20" y="40" width="80" height="10" rx="5" fill="#c7d2fe"/>
                <rect x="20" y="60" width="90" height="10" rx="5" fill="#c7d2fe"/>
              </motion.g>
              
              <motion.g 
                transform="translate(180,140)"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <rect x="0" y="0" width="140" height="160" rx="10" fill="white" opacity="0.9"/>
                <rect x="20" y="20" width="100" height="10" rx="5" fill="#818cf8"/>
                <rect x="20" y="40" width="80" height="10" rx="5" fill="#c7d2fe"/>
                <rect x="20" y="60" width="90" height="10" rx="5" fill="#c7d2fe"/>
              </motion.g>
              
              {/* Central circular elements */}
              <motion.circle 
                cx="400" cy="200" r="80" fill="white" opacity="0.2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              />
              <motion.circle 
                cx="400" cy="200" r="60" fill="white" opacity="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              />
              <motion.circle 
                cx="400" cy="200" r="40" fill="white" opacity="0.4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
              />
              
              {/* Decorative dots */}
              <g fill="white" opacity="0.5">
                <motion.circle 
                  cx="200" cy="100" r="4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 1, duration: 0.5 }}
                />
                <motion.circle 
                  cx="600" cy="150" r="4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                />
                <motion.circle 
                  cx="550" cy="80" r="4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                />
                <motion.circle 
                  cx="250" cy="300" r="4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                />
                <motion.circle 
                  cx="650" cy="250" r="4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                />
              </g>
            </svg>
          </motion.div>
        </div>
        
        {/* Stats Bar */}
        <motion.div 
          className="relative bg-white bg-opacity-10 backdrop-blur-lg border-t border-white border-opacity-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex justify-around py-6 px-8">
            <motion.div 
              className="text-center text-white"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                1.2K+
              </motion.div>
              <div className="text-sm opacity-80">Articles</div>
            </motion.div>
            <motion.div 
              className="text-center text-white"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                50K+
              </motion.div>
              <div className="text-sm opacity-80">Readers</div>
            </motion.div>
            <motion.div 
              className="text-center text-white"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                100+
              </motion.div>
              <div className="text-sm opacity-80">Authors</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Search Bar */}
      <motion.div 
        className="mb-8 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for articles, topics, or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 pl-14 pr-4 rounded-xl bg-white border-2 border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-gray-700 placeholder-gray-400 shadow-md transition-all duration-300"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
          
          {searchQuery && (
            <motion.button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
              onClick={() => setSearchQuery('')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Categories Sidebar */}
        <motion.div 
          className="w-full md:w-64 flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <Tags size={20} className="text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
            </div>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium shadow-md'
                      : `${category.color} hover:bg-indigo-50 text-gray-700 hover:text-indigo-600`
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)" 
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <motion.div 
        className="flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
          {/* Pagination Logic */}

          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((blog, index) => (
                <motion.div 
                  key={blog?._id}
                  className="group rounded-xl overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out bg-white cursor-pointer"
                  onClick={() => handleBlogClick(blog?._id)}
                  variants={itemVariants}
                  whileHover="hover"
                  custom={index}
                  layout
                >
                  {/* Blog Image with Overlay */}
                  <div className="h-48 w-full overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ opacity: 1 }}
                    />
                    <motion.img 
                      src={`${SERVER_URL}/uploads/${blog?.blogImage}`} 
                      alt={blog?.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Category Badge Overlay */}
                    <motion.span 
                      className="absolute top-3 left-3 text-sm font-light text-black bg-slate-200 bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-lg z-20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.05) }}
                    >
                      {blog?.category}
                    </motion.span>
                  </div>

                  {/* Blog Content */}
                  <div className="p-5 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200">
                      {blog?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 flex-grow">
                      {blog?.excerpt}
                    </p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                      {/* Author Section */}
                      <motion.div 
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {blog?.username ? blog?.username.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <span className="font-medium">{blog?.username || 'Anonymous'}</span>
                      </motion.div>
                      <div className="flex space-x-3">
                        <motion.div 
                          className="flex items-center space-x-1"
                          whileHover={{ scale: 1.1, color: "#6366f1" }}
                        >
                          <Eye size={16} />
                          <span>{formatNumber(blog?.viewCount)}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center space-x-1"
                          whileHover={{ scale: 1.1, color: "#ec4899" }}
                        >
                          <Heart size={16} />
                          <span>{formatNumber(blog?.likeCount)}</span>
                        </motion.div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      <span>{blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Recent'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="flex flex-col items-center justify-center py-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-xl text-gray-500 mb-4">No posts found</div>
              {selectedCategory !== 'All' && (
                <motion.button 
                  onClick={() => setSelectedCategory('All')}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Posts
                </motion.button>
              )}
            </motion.div>
          )}
          </motion.div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
              >
                Prev
              </button>

              {Array.from({ length: Math.ceil(filteredBlogs.length / postsPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-md ${currentPage === i + 1 ? "bg-indigo-700 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredBlogs.length / postsPerPage)))}
                disabled={currentPage === Math.ceil(filteredBlogs.length / postsPerPage)}
                className={`px-4 py-2 rounded-md ${currentPage === Math.ceil(filteredBlogs.length / postsPerPage) ? "bg-gray-300" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
              >
                Next
              </button>
          </div>
    </div>
  );
};

export default BlogsCollection;