// utils/userUtils.js - Utility functions for user-related operations

/**
 * Gets the current user ID from session storage
 * @returns {string|null} User ID or null if not found
 */
export const getCurrentUserId = () => {
    try {
      const storedUser = sessionStorage.getItem("existingUser");
      
      // If existingUser is a valid JSON string, parse it
      if (storedUser && storedUser.includes("{")) {
        try {
          const jsonStartIndex = storedUser.indexOf("{");
          const jsonString = storedUser.substring(jsonStartIndex);
          const parsedUser = JSON.parse(jsonString);
          return parsedUser._id;
        } catch (jsonError) {
          console.error("Error parsing JSON from existingUser:", jsonError);
        }
      }
      
      // Try to extract userId from token if it's a JWT
      const token = sessionStorage.getItem("token");
      if (token && token.includes(".")) {
        try {
          // Split the token into its parts
          const tokenParts = token.split(".");
          // The payload is the second part, base64 encoded
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.userId) {
            return payload.userId;
          }
        } catch (tokenError) {
          console.error("Error extracting userId from token:", tokenError);
        }
      }
      
      // As a last resort, check if there's a userId directly in session storage
      return sessionStorage.getItem("userId");
    } catch (error) {
      console.error("Error in getCurrentUserId:", error);
      return null;
    }
  };
  
  /**
   * Gets the current username from session storage
   * @returns {string} Username or "Anonymous" if not found
   */
  export const getCurrentUsername = () => {
    try {
      const storedUser = sessionStorage.getItem("existingUser");
      
      // If existingUser is a valid JSON string, parse it
      if (storedUser && storedUser.includes("{")) {
        try {
          const jsonStartIndex = storedUser.indexOf("{");
          const jsonString = storedUser.substring(jsonStartIndex);
          const parsedUser = JSON.parse(jsonString);
          return parsedUser.username || "Anonymous";
        } catch (jsonError) {
          console.error("Error parsing JSON from existingUser:", jsonError);
        }
      }
      
      // Check for username directly in session storage
      const directUsername = sessionStorage.getItem("username");
      if (directUsername) return directUsername;
      
      return "Anonymous";
    } catch (error) {
      console.error("Error in getCurrentUsername:", error);
      return "Anonymous";
    }
  };
  
  /**
   * Format date to a readable format
   * @param {string} dateString - The date string to format
   * @returns {string} Formatted date string
   */
  export const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown Date";
    }
  };