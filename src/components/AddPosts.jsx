import React, { useState, useContext } from 'react';
import { Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addBlogAPI } from '../services/allAPI';
import { addProjectRespnseContext } from '../contexts/BlogContextApi';

const AddPosts = () => {
  const navigate = useNavigate();
  const { setAddProjectRespnse } = useContext(addProjectRespnseContext);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    blogImage: null,
    category: 'Technology'
  });
  
  // Preview state for the uploaded image
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add a state for content preview
  const [showContentPreview, setShowContentPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        blogImage: file
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Helper function to format content with line breaks
  const formatContentWithLineBreaks = (text) => {
    if (!text) return '';
    
    // Replace all line breaks with HTML line breaks
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { title, content, blogImage, category } = formData;
    
    if (title && content && blogImage && category) {
      setIsSubmitting(true);
      
      const reqBody = new FormData();
      reqBody.append("title", title);
      reqBody.append("content", content);
      reqBody.append("blogImage", blogImage);
      reqBody.append("category", category);
      
      const token = sessionStorage.getItem("token");
      
      if (token) {
        const reqHeader = {
          "Authorization": `Bearer ${token}`
        };
        
        try {
          const result = await addBlogAPI(reqBody, reqHeader);
          
          // Check both status and response data
          if (result.status === 201 || result.data.status === 'success') {
            // Update the context with success response
            setAddProjectRespnse(result.data);
            
            alert("Blog post added successfully");
            
            // Reset form
            setFormData({
              title: '',
              content: '',
              blogImage: null,
              category: 'Technology'
            });
            setImagePreview(null);
            setShowContentPreview(false);
            
            navigate('/profile');
          } else {
            // If response exists but status isn't 201
            alert(result.data?.message || 'Failed to add blog post');
          }
        } catch (err) {
          // Log the full error and response for debugging
          console.log('Full error:', err);
          console.log('Error response:', err.response);
          
          // Check if we have a specific error message from the server
          const errorMessage = err.response?.data?.message || 'Failed to add blog post. Please try again.';
          alert(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        alert('Please login to add a blog post');
        setIsSubmitting(false);
      }
    } else {
      alert('Please fill all required fields');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-48 mx-auto rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, blogImage: null }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                >
                  <Image className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Image className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Drop your image here, or</p>
                <input
                  type="file"
                  id="blogImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="blogImage"
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  browse
                </label>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>

          {/* Category */}
          <div>
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Technology">Technology</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Health">Health</option>
              <option value="Business">Business</option>
              <option value="Art">Art</option>
              <option value="Science">Science</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label 
              htmlFor="content" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <div className="mb-2">
              <small className="text-gray-500">Tip: Press Enter to create a new line or bullet point. Line breaks will be preserved when displayed.</small>
            </div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="12"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="Write your post content here...
              
• Press Enter for new lines
• Start a line with • to create bullet points
• Format will be preserved when displayed"
            />
          </div>

          {/* Content Preview */}
          <div>
            <div className="flex items-center mb-4">
              <button
                type="button"
                onClick={() => setShowContentPreview(!showContentPreview)}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                {showContentPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            
            {showContentPreview && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold mb-2">Content Preview:</h3>
                <div className="prose max-w-none">
                  {formatContentWithLineBreaks(formData.content)}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-colors`}
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPosts;