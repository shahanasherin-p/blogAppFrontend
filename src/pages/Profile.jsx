import React, { useEffect, useState } from "react";
import { Grid } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { userAllBlogsAPI, userProfileAPI } from "../services/allAPI";
import SERVER_URL from "../services/serverUrl";

const Profile = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [userProfile, setUserProfile] = useState({ 
    username: "", 
    bio: "No bio yet", 
    followers: [],
    following: [],
    profileImage: "",
    email: ""
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch user data from API
    fetchUserProfile();
    // Still get posts from API
    getUserPosts();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setIsLoading(false);
        return;
      }

      // Pass the authentication header to the API
      const headers = { Authorization: `Bearer ${token}` };
      const result = await userProfileAPI(headers);
      
      if (result.status !== 200) {
        setError("Failed to fetch user profile");
        setIsLoading(false);
        return;
      }

      // The backend returns an array, so we need to get the first item
      const userData = result.data[0]; 
      
      setUserProfile({
        username: userData.username || "Unknown User",
        bio: userData.bio || "No bio yet",
        email: userData.email || "",
        profileImage: userData.profileImage || "",
        followers: Array.isArray(userData.followers) ? userData.followers : [],
        following: Array.isArray(userData.following) ? userData.following : [],
        posts: userData.posts || 0,
        _id: userData._id || ""
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Error loading profile");
      setIsLoading(false);
    }
  };

  const getUserPosts = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const result = await userAllBlogsAPI({ Authorization: `Bearer ${token}` });
      if (result.status === 200) setAllPosts(result.data);
    } catch (err) {
      console.error("API Error:", err);
      setError("Error fetching posts");
    }
  };

  // Function to handle navigation to edit profile page with user data
  const handleEditProfile = () => {
    navigate('/edit-profile', { state: { userProfile } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
          {userProfile.profileImage ? (
            <img src={`${SERVER_URL}/uploads/${userProfile.profileImage}`} alt="Profile" className="w-full h-full object-cover" onError={(e) => (e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")} />
          ) : (
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Profile" className="w-full h-full object-cover" />
          )}
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {userProfile.username || "Username not found"}
        </h1>
        {userProfile.email && (
          <p className="text-gray-500 text-sm mb-1">{userProfile.email}</p>
        )}
        <p className="text-gray-600 mb-4">{userProfile.bio || "No bio yet"}</p>
        <div className="flex justify-center gap-8 w-full mb-6">
          <div className="text-center">
            <div className="font-semibold text-lg text-gray-900">{allPosts.length}</div>
            <div className="text-sm text-gray-600">posts</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-gray-900">{userProfile.followers?.length || 0}</div>
            <div className="text-sm text-gray-600">followers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg text-gray-900">{userProfile.following?.length || 0}</div>
            <div className="text-sm text-gray-600">following</div>
          </div>
        </div>
        <button 
          onClick={handleEditProfile}
          className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Edit Profile
        </button>
      </div>
      
      <div className="border-t pt-8">
        <h2 className="flex items-center justify-center gap-5 mb-6 text-gray-900">
          <Grid className="w-10 h-10" /> Posts
        </h2>
        {allPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allPosts.map((post) => (
              <div key={post._id} className="aspect-square bg-gray-100 relative group rounded-lg cursor-pointer" onClick={() => navigate(`/blog/${post._id}`)}>
                <img src={`${SERVER_URL}/uploads/${post?.blogImage}`} alt={post.title} className="w-full h-full object-cover rounded-lg" onError={(e) => (e.target.src = "/default-image.png")} />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
                  <h3 className="text-white text-sm px-2 text-center">{post?.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No posts found.</p>
        )}
      </div>
      <Dashboard />
    </div>
  );
};

export default Profile;