import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import './assets/prism.css'
import Loading from './pages/Loading'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast' 

const App = () => {

  const {user, loadingUser, theme} = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading' || loadingUser) return <Loading />

  return (
    <>
    <Toaster 
      toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white',
        style: {
          background: theme === 'dark' ? '#1f2937' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
        },
      }}
    />
    
    {/* Mobile Menu Button */}
{!isMenuOpen && (
  <svg
    className={`absolute top-6 left-6 w-8 h-8 cursor-pointer md:hidden z-20 transition-all duration-300 ${
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`}
    onClick={() => setIsMenuOpen(true)}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)}

    {user ? (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-900'
      }`}>
        <div className="flex h-screen w-screen">
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
    ) : (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800' 
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50'
      }`}>
        <div className="flex items-center justify-center min-h-screen w-screen">
          <Login />
        </div>
      </div>
    )}
    </>
  )
}

export default App