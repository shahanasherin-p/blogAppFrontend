import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { updateProfileAPI } from "../services/allAPI";
import SERVER_URL from "../services/serverUrl";

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Get user profile data from location state
  const userProfileFromState = location.state?.userProfile;
  
  // Initialize form data with user profile data
  const [formData, setFormData] = useState({
    name: userProfileFromState?.username || "", // Map username to name
    username: userProfileFromState?.username || "",
    bio: userProfileFromState?.bio || "",
    profileImage: userProfileFromState?.profileImage || "",
    newProfileImage: null
  });

  // If no user profile data is passed, fetch it from API
  useEffect(() => {
    if (!userProfileFromState) {
      // Redirect back to profile if no data is available
      navigate('/profile');
    }
  }, [userProfileFromState, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        newProfileImage: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      // Create FormData for API request
      const profileData = new FormData();
      
      // Match field names with what your controller expects
      profileData.append("name", formData.name);
      profileData.append("username", formData.username);
      profileData.append("bio", formData.bio);
      
      // Include existing profile image if no new one selected
      if (formData.newProfileImage) {
        profileData.append("profileImage", formData.newProfileImage);
      } else if (formData.profileImage) {
        profileData.append("profileImage", formData.profileImage);
      }

      // Make API request
      const result = await updateProfileAPI(profileData, { 
        Authorization: `Bearer ${token}` 
      });

      if (result.status === 200) {
        setSuccessMessage("Profile updated successfully!");
        // Navigate back to profile after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-8">Edit Profile</h1>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
              {formData.newProfileImage ? (
                <img 
                  src={URL.createObjectURL(formData.newProfileImage)} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : formData.profileImage ? (
                <img 
                  src={`${SERVER_URL}/uploads/${formData.profileImage}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  onError={(e) => (e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")} 
                />
              ) : (
                <img 
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
            <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
              Change Profile Picture
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-gray-700 mb-2">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            ></textarea>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <Dashboard />
    </div>
  );
};

export default EditProfile;