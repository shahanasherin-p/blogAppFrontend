import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Auth from './pages/Auth'
import PostDetails from './pages/PostDetails'
import BlogsCollection from './pages/BlogsCollection'
import Dashboard from './components/Dashboard'
import Profile from './pages/Profile'
import EditProfile from './components/EditProfile'
import AddPost from './components/AddPosts'
import EditPosts from './components/EditPosts'
import AdminDashboard from './admin/AdminDashboard'
import PostsManagement from './admin/PostsManagement'
import CommentsManagement from './admin/CommentsManagement'
import UserManagement from './admin/UserManagement'
import FollowingFeed from './pages/FollowingFeed'

function App() {
  const location = useLocation();
  
  const noHeaderPaths = ['/login', '/register', '/dashboard', '/edit-profile', '/add-post', '/edit-post', '/admin'];
  
  const showHeader = !noHeaderPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  const noFooterPaths=['/login', '/register', '/dashboard', '/edit-profile', '/add-post', '/edit-post', '/admin'];

  const showFooter = !noFooterPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/login' element={<Auth/>}/>
        <Route path='/register' element={<Auth insideRegister={true}/>}/>
        <Route path='/blog/:id' element={<PostDetails/>}/>
        <Route path='/allBlogs' element={<BlogsCollection/>} />
        <Route path='/my-network-posts' element={<FollowingFeed/>}/>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/edit-profile' element={<EditProfile/>}/>
        <Route path='/add-post' element={<AddPost/>}/>
        <Route path='/edit-post/:id' element={<EditPosts/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/admin/posts' element={<PostsManagement />} />
        <Route path='/admin/comments' element={<CommentsManagement />} />
        <Route path='/admin/users' element={<UserManagement />} />
      </Routes>
      {showFooter && <Footer/>}
    </>
  );
}

export default App
