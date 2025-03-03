import commonAPI from "./commonAPI";
import SERVER_URL from "./serverUrl";


// register api called by auth component when user clicks register button
export const registerAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/register`,reqBody)
}

// login api called by auth component when user clicks login button
export const loginAPI=async(reqBody)=>{
    return await commonAPI("POST",`${SERVER_URL}/login`,reqBody)
}

//add-blog:http://localhost:3000/add-blogs
export const addBlogAPI=async(reqBody,reqHeader)=>{
    return await commonAPI("POST",`${SERVER_URL}/add-blog`,reqBody,reqHeader)
}

//all-blog:http://localhost:3000/all-blogs
export const allBlogsAPI=async(reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/get-allBlogs`,null,reqHeader)
}

//single-blog:http://localhost:3000/blog/${id}/view 
export const singleBlogsAPI=async(id,reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/blog/${id}/view`,null,reqHeader)
}

//all-blog-user:http://localhost:3000/all-blogs
export const userAllBlogsAPI=async(reqHeader)=>{
    return await commonAPI("GET",`${SERVER_URL}/user-blogs`,null,reqHeader)
}

//edit-blog:http://localhost:3000/edit-blogs
export const updateBlogAPI=async(id,reqBody,reqHeader)=>{
    return await commonAPI("PUT",`${SERVER_URL}/blog/${id}/edit`,reqBody,reqHeader)
}

//delete-blog:http://localhost:3000/delete-blogs
export const deleteBlogAPI=async(id,reqHeader)=>{
    return await commonAPI("DELETE",`${SERVER_URL}/blog/${id}/remove`,{},reqHeader)
}

//like-blog:http://localhost:3000//post/${id}/like
export const likePostAPI = async (id, reqHeader) => {
    return await commonAPI("PUT", `${SERVER_URL}/post/${id}/like`, {}, reqHeader);
};

//view-blog:http://localhost:3000/post/${id}/viewPost
export const viewPostAPI = async (id, reqHeader) => {
    return await commonAPI("PUT", `${SERVER_URL}/post/${id}/viewPost`, {}, reqHeader);
};

//follow-user:http://localhost:3000/user/${id}/follow
export const followUserAPI = async (id, reqHeader) => {
    return await commonAPI("POST", `${SERVER_URL}/user/follow/${id}`, {}, reqHeader);
};

//unfollow-user:http://localhost:3000/user/${id/unfollow}
export const unfollowUserAPI = async (id, reqHeader) => {
    return await commonAPI("POST", `${SERVER_URL}/user/unfollow/${id}`, {}, reqHeader);
};

// Add a comment to a blog post
export const addCommentAPI = async (id, commentData, reqHeader) => {
    return await commonAPI("POST", `${SERVER_URL}/post/${id}/comment`, commentData, reqHeader);
};

// Get all comments for a blog post
export const getCommentsAPI = async (id,reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/post/${id}/comments`,{},reqHeader);
};

// Delete a comment
export const deleteCommentAPI = async (id, commentId, reqHeader) => {
    return await commonAPI("DELETE", `${SERVER_URL}/post/${id}/comment/${commentId}`, {}, reqHeader);
};

// Get user details
export const userProfileAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/user-profile`, null, reqHeader);
};


// edit profile
export const updateProfileAPI = async (formData, header) => {
    return await commonAPI("PUT", `${SERVER_URL}/edit-profile`, formData, header);
};

// get all users
export const getAllUsersAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/all-users`,{} ,reqHeader);
};

// get all comments
export const getAllCommentsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/all-comments`,{}, reqHeader);
};

// delete a user 
export const deleteUserAPI=async(id,reqHeader)=>{
    return await commonAPI("DELETE",`${SERVER_URL}/user/${id}/remove`,{},reqHeader)
}

// get home posts
export const getHomeProjectApi=async()=>{
    return await commonAPI("GET",`${SERVER_URL}/home-posts`,{})
}

// get home users
export const getHomeUserApi=async()=>{
    return await commonAPI("GET",`${SERVER_URL}/home-users`,{})
}

// get posts category wise
export const getPostscategoryApi=async()=>{
    return await commonAPI("GET",`${SERVER_URL}/category-wise-count`,{})
}
 
// get followed users posts
export const getUserFollowedPostsAPI = async (reqHeader) => {
    return await commonAPI("GET", `${SERVER_URL}/followed`,{}, reqHeader);
};




