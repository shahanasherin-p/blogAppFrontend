import React, { createContext, useState } from 'react'

export const addProjectRespnseContext=createContext()
export const editProjectResponseContext=createContext()

export const likePostResponseContext = createContext();
export const viewPostResponseContext = createContext();

export const followUserResponseContext = createContext();
export const unfollowUserResponseContext = createContext();


const BlogContextApi = ({children}) => {
    const [addProjectRespnse,setAddProjectRespnse]=useState("")
    const [editProjectResponse,setEditProjectResponse]=useState("")
    const [likePostResponse, setLikePostResponse] = useState("");
    const [viewPostResponse, setViewPostResponse] = useState("");
    const [followUserResponse, setFollowUserResponse] = useState("");
    const [unfollowUserResponse, setUnfollowUserResponse] = useState("");
  return (
    <editProjectResponseContext.Provider value={{editProjectResponse,setEditProjectResponse}}>
      <addProjectRespnseContext.Provider value={{addProjectRespnse,setAddProjectRespnse}}>
        <unfollowUserResponseContext.Provider value={{ unfollowUserResponse, setUnfollowUserResponse }}>
          <followUserResponseContext.Provider value={{ followUserResponse, setFollowUserResponse }}>
            <viewPostResponseContext.Provider value={{ viewPostResponse, setViewPostResponse }}>
              <likePostResponseContext.Provider value={{ likePostResponse, setLikePostResponse }}>
                {children}
              </likePostResponseContext.Provider>
            </viewPostResponseContext.Provider>
          </followUserResponseContext.Provider>
        </unfollowUserResponseContext.Provider>
      </addProjectRespnseContext.Provider>
    </editProjectResponseContext.Provider>
  )
}

export default BlogContextApi