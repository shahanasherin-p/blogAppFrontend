import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './contexts/AuthContext.jsx'
import BlogContextApi from './contexts/BlogContextApi.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContext>
        <BlogContextApi>
            <App />
        </BlogContextApi>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>,
)
