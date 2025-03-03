import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, PenSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  
  // Check for auth token on component mount and when it changes
  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem("token");
      setHasToken(!!token);
    };

    // Initial check
    checkToken();

    // Set up event listeners
    window.addEventListener('storage', checkToken);
    window.addEventListener('authStateChanged', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('authStateChanged', checkToken);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("authStateChanged"));
    navigate("/");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative bg-white">
      <div className="relative z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                <span className="text-lg sm:text-xl font-bold text-gray-900">BlogPlatform</span>
              </Link>
              <nav className="hidden md:ml-8 md:flex space-x-4 lg:space-x-8">
                <Link to="/" className="text-gray-900 hover:text-indigo-600 px-2 lg:px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </Link>
                {hasToken && (
                  <Link to="/allBlogs" className="text-gray-500 hover:text-indigo-600 px-2 lg:px-3 py-2 text-sm font-medium transition-colors">
                    Explore
                  </Link>
                )}
                 {hasToken && (
                  <Link to="/my-network-posts" className="text-gray-500 hover:text-indigo-600 px-2 lg:px-3 py-2 text-sm font-medium transition-colors">
                    My Network Posts
                  </Link>
                )}
              </nav>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {hasToken ? (
                <>
                  {/* Write Post Button */}
                  <Link to="/add-post" className="hidden sm:block">
                    <button className="flex items-center space-x-1 sm:space-x-2 bg-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      <PenSquare className="h-4 w-4" />
                      <span className="text-xs sm:text-sm font-medium">Write</span>
                    </button>
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileOpen(!isProfileOpen);
                      }}
                      className="flex items-center space-x-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                      </div>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                          My Profile
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login">
                  <button className="flex items-center space-x-1 sm:space-x-2 bg-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <span className="text-xs sm:text-sm font-medium">Sign In</span>
                  </button>
                </Link>
              )}
              
              <button 
                className="md:hidden p-1.5"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Simplified */}
      {isMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-white border-b border-gray-100 shadow-lg z-10">
          <div className="px-4 py-2 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              Home
            </Link>
            
            {hasToken ? (
              <>
                <Link to="/allBlogs" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                  Explore
                </Link>
                
                <Link to="/add-post" className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                  Write a Post
                </Link>
                <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;