import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { singleBlogsAPI, updateBlogAPI } from "../services/allAPI";
import { editProjectResponseContext } from "../contexts/BlogContextApi";
import SERVER_URL from "../services/serverUrl";

const EditPosts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Access the edit project response context
  const { setEditProjectResponse } = useContext(editProjectResponseContext);
  
  const [preview, setPreview] = useState("");
  const [imageStatus, setImageStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalImage, setOriginalImage] = useState("");
  // Add a state for content preview
  const [showContentPreview, setShowContentPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    blogImage: "",
    category: "development",
  });

  // Fetch existing blog post data - only once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const fetchBlogData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          if (isMounted) setError("Please login to edit this post");
          return;
        }

        const reqHeader = {
          Authorization: `Bearer ${token}`,
        };

        const response = await singleBlogsAPI(id, reqHeader);

        if (response.status === 200 && isMounted) {
          const blogData = response.data;
          setFormData({
            title: blogData.title,
            content: blogData.content,
            category: blogData.category || "development",
            blogImage: ""
          });
          
          // Store original image filename
          if (blogData.blogImage) {
            setOriginalImage(blogData.blogImage);
          }
        } else if (isMounted) {
          setError("Failed to load blog post");
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load blog post");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBlogData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [id]); // Only depend on id

  // Handle image preview when a new image is selected
  useEffect(() => {
    if (formData.blogImage) {
      if (['image/png', 'image/jpg', 'image/jpeg'].includes(formData.blogImage.type)) {
        setImageStatus(true);
        setPreview(URL.createObjectURL(formData.blogImage));
      } else {
        setImageStatus(false);
        setPreview("");
        setFormData(prev => ({ ...prev, blogImage: "" }));
      }
    }
  }, [formData.blogImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        blogImage: file,
      }));
    }
  };

  // Helper function to format content with line breaks - same as in AddPosts
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

    if (title && content && category) {
      setIsSubmitting(true);
      const reqBody = new FormData();
      reqBody.append("title", title);
      reqBody.append("content", content);
      reqBody.append("category", category);

      // Only append new image if selected
      if (blogImage) {
        reqBody.append("blogImage", blogImage);
      } else if (originalImage) {
        // Add the original image filename so backend can keep it
        reqBody.append("existingImage", originalImage);
      }

      const token = sessionStorage.getItem("token");

      if (token) {
        const reqHeader = {
          Authorization: `Bearer ${token}`,
        };

        try {
          const result = await updateBlogAPI(id, reqBody, reqHeader);

          if (result.status === 200) {
            // Update the context with the latest response
            setEditProjectResponse(result.data);
            alert("Blog post updated successfully");
            navigate('/dashboard');
          } else {
            alert(result.data?.message || "Failed to update blog post");
          }
        } catch (err) {
          console.log("Full error:", err);
          
          const errorMessage =
            err.response?.data?.message ||
            "Failed to update blog post. Please try again.";
          alert(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        alert("Please login to update this blog post");
        setIsSubmitting(false);
      }
    } else {
      alert("Please fill all required fields");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading post data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <label>
              <input
                type="file"
                id="blogImage"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <img
                src={preview ? preview : `${SERVER_URL}/uploads/${originalImage || 'default-image.png'}`}
                alt="Preview"
                className="max-h-48 mx-auto rounded cursor-pointer"
                onError={(e) => {
                  e.target.src = "/assets/default-image.png";
                }}
              />
            </label>
            {!imageStatus && formData.blogImage && (
              <div className="text-red-500 mt-2">*Upload only jpeg, jpg, or png files!</div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <div className="mb-2">
              <small className="text-gray-500">Tip: Press Enter to create a new line or bullet point. Line breaks will be preserved when displayed.</small>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
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

          {/* Submit */}
          <div className="flex space-x-4">
            <button 
              type="submit" 
              className={`${isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-2 rounded-lg transition-colors`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </button>
            <button 
              type="button" 
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPosts;