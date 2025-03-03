import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { tokenAuthContext } from "../contexts/AuthContext";
import { loginAPI, registerAPI } from "../services/allAPI";

const Auth = ({ insideRegister }) => {
  const { isAuthorised, setIsAuthorised } = useContext(tokenAuthContext);
  const [isLogined, setIsLogined] = useState(false);
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (inputData.email && inputData.password && inputData.username) {
      try {
        const result = await registerAPI(inputData);
        if (result.status === 200) {
          alert(`Welcome ${result.data?.username}, Please login to explore our website!`);
          navigate("/login");
          setInputData({ username: "", email: "", password: "" });
        } else if (result.response?.status === 406) {
          alert(result.response.data);
          setInputData({ username: "", email: "", password: "" });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (inputData.email && inputData.password) {
      try {
        const result = await loginAPI(inputData);
        if (result.status === 200) {
          sessionStorage.setItem("user", JSON.stringify(result.data.user));
          sessionStorage.setItem("token", result.data.token);
          setIsAuthorised(true);
          setIsLogined(true);
          
          // Redirect based on user role
          const userRole = result.data.user.role;
          setTimeout(() => {
            setInputData({ username: "", email: "", password: "" });
            
            // Navigate based on role
            if (userRole === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }, 2000);
        } else if (result.response?.status === 404) {
          alert(result.response.data);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Illustration & Branding */}
        <div className="lg:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-12 flex flex-col justify-center items-center text-white text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            {insideRegister ? "Join Us Today!" : "Welcome Back!"}
          </h2>
          <p className="text-indigo-100 mb-6 text-lg">
            {insideRegister
              ? "Create an account and be part of our growing community."
              : "Sign in to continue your journey with us."}
          </p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <img
              src="https://img.freepik.com/free-vector/two-factor-authentication-concept-illustration_114360-5598.jpg"
              alt="Illustration"
              className="w-3/4 rounded-lg shadow-lg mx-10"
            />
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {insideRegister ? "Create an Account" : "Sign In"}
          </h3>

          <form className="space-y-5" onSubmit={insideRegister ? handleRegister : handleLogin}>
            {insideRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={inputData.username}
                  onChange={(e) => setInputData({ ...inputData, username: e.target.value })}
                  placeholder="johndoe"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all outline-none"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={inputData.email}
                onChange={(e) => setInputData({ ...inputData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all outline-none"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={inputData.password}
                onChange={(e) => setInputData({ ...inputData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all outline-none"
              />
            </div>

            <div className="flex flex-col space-y-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg font-semibold"
              >
                {insideRegister ? "Sign Up" : "Sign In"}
              </motion.button>

              <p className="text-center text-sm text-gray-600">
                {insideRegister ? "Already have an account?" : "Don't have an account?"}
                <Link to={insideRegister ? "/login" : "/register"} className="text-indigo-600 hover:text-indigo-500 font-medium ml-1">
                  {insideRegister ? "Sign In" : "Sign Up"}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
