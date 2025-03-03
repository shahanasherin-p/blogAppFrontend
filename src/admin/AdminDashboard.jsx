import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Search, Bell, User, LogOut, ChevronDown, Home, FileText, MessageSquare, Users } from 'lucide-react';
import { getAllUsersAPI, allBlogsAPI, getAllCommentsAPI } from '../services/allAPI';
import Sidebar from './Sidebar';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center shadow-sm">
      <div className="flex items-center">
        <button className="md:hidden mr-4 text-gray-500 focus:outline-none">
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">Admin User</span>
        </div>
      </div>
    </header>
  );
};

const AdminDashboard = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ users: 0, blogs: 0, comments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiErrors, setApiErrors] = useState({ users: null, blogs: null, comments: null });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const reqHeader = { "Authorization": `Bearer ${token}` };

        let userCount = 0, blogCount = 0, commentCount = 0;
        let errors = { users: null, blogs: null, comments: null };

        try {
          const usersResponse = await getAllUsersAPI(reqHeader);
          if (usersResponse?.status === 200 && usersResponse?.data) {
            userCount = usersResponse.data.length;
          }
        } catch (err) {
          errors.users = `Users: ${err.response?.data?.message || err.message || 'Server error'}`;
        }

        try {
          const blogsResponse = await allBlogsAPI(reqHeader);
          if (blogsResponse?.status === 200 && blogsResponse?.data) {
            blogCount = blogsResponse.data.length;
          }
        } catch (err) {
          errors.blogs = `Blogs: ${err.response?.data?.message || err.message || 'Server error'}`;
        }

        try {
          const commentsResponse = await getAllCommentsAPI(reqHeader);
          if (commentsResponse?.status === 200 && commentsResponse?.data) {
            commentCount = commentsResponse.data.length;
          }
        } catch (err) {
          errors.comments = `Comments: ${err.response?.data?.message || err.message || 'Server error'}`;
        }

        setCounts({ users: userCount, blogs: blogCount, comments: commentCount });
        setApiErrors(errors);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white">
            <Sidebar />
          </div>
        </div>
      )}
      
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{counts.users}</h3>
                  </div>
                  <Users size={20} className="text-indigo-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Posts</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{counts.blogs}</h3>
                  </div>
                  <FileText size={20} className="text-indigo-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Comments</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{counts.comments}</h3>
                  </div>
                  <MessageSquare size={20} className="text-indigo-600" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;