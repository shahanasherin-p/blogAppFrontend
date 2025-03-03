import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteUserAPI, getAllUsersAPI } from '../services/allAPI'; 
import Sidebar from './Sidebar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
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
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        const reqHeader = {
          "Authorization": "Bearer " + sessionStorage.getItem("token") 
        };
        
        const response = await getAllUsersAPI(reqHeader);
        
        if (response?.status === 200 && response?.data) {
          setUsers(response.data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || err.message || "An error occurred while fetching users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, e) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      const token = sessionStorage.getItem("token");
      
      if (token) {
        const reqHeader = {
          Authorization: `Bearer ${token}`,
        };
        
        try {
          const result = await deleteUserAPI(id, reqHeader);
          
          if (result.status === 200) {
            setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
            alert('User deleted successfully');
          } else {
            alert('Failed to delete user');
          }
        } catch (err) {
          console.log("Delete Error:", err);
          alert('Error deleting user');
        }
      }
    }
  };

  // Render card view for mobile
  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {users.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow text-center text-gray-500">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id || user.id} className="bg-white p-4 rounded-md shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Name</span>
                    <p className="font-medium">{user.name || user.username}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Email</span>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Role</span>
                    <p className="text-sm">{user.role || user.userType || "User"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase">ID</span>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{user._id || user.id}</p>
                  </div>
                </div>
                <button 
                  className="text-red-600 hover:text-red-800 p-2" 
                  onClick={(e) => handleDeleteUser(user._id || user.id, e)}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                    {user._id || user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.name || user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role || user.userType || "User"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-red-600 hover:text-red-800" onClick={(e) => handleDeleteUser(user._id || user.id, e)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Users</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          isMobile ? renderMobileView() : renderDesktopView()
        )}
      </div>
    </div>
  );
};

export default UserManagement;