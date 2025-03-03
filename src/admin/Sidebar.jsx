import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, FileText, MessageSquare, Users, LogOut, Menu, X } from "lucide-react";

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      category: "dashboard",
      label: "Dashboard",
      icon: <Home size={18} />,
      path: "/admin",
    },
    {
      category: "users",
      label: "All Users",
      icon: <Users size={18} />,
      path: "/admin/users",
    },
    {
      category: "posts",
      label: "All Posts",
      icon: <FileText size={18} />,
      path: "/admin/posts",
    },
    {
      category: "comments",
      label: "All Comments",
      icon: <MessageSquare size={18} />,
      path: "/admin/comments",
    },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const NavItems = () => (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <div key={item.category} className="mb-2">
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
            onClick={() => {
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        </div>
      ))}
    </nav>
  );

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.dispatchEvent(new Event("authStateChanged"));
    navigate("/");
  };

  return (
    <>
      {/* Mobile menu button - visible on small screens */}
      <div className="md:hidden fixed top-0 left-0 z-40 w-full bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Admin</h2>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu - slides in from left */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800">Admin</h2>
              </div>
            </div>
            <div className="p-4">
              <NavItems />
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
              <button
                className="flex items-center text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg w-full"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-3" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar - visible on md screens and above */}
      <aside className="h-screen bg-white border-r border-gray-200 w-64 hidden md:block pt-6 px-4">
        <div className="px-3 mb-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Admin</h2>
          </div>
        </div>
        <NavItems />
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200">
          <button
            className="flex items-center text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg w-full"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-3" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Content padding for mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Sidebar;