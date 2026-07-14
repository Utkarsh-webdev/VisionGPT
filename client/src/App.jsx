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
import { Toaster } from 'react-hot-toast'

const App = () => {

  const { user, loadingUser, theme } = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading' || loadingUser) return <Loading />

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'dark:bg-[#1C1830] dark:text-white',
          style: {
            background: theme === 'dark' ? '#1C1830' : '#fff',
            color: theme === 'dark' ? '#EFEDFB' : '#16132A',
            border: theme === 'dark' ? '1px solid #2A2440' : '1px solid #E4E0F5',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />

      {/* Mobile Menu Button */}
      {user && !isMenuOpen && (
        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          className={`fixed top-5 left-5 z-30 flex items-center justify-center w-10 h-10 rounded-xl md:hidden
            backdrop-blur-xl border transition-colors
            ${theme === 'dark'
              ? 'bg-[#15121F]/80 border-[#2A2440] text-[#EFEDFB]'
              : 'bg-white/80 border-[#E4E0F5] text-[#16132A]'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {user ? (
        <div className="min-h-screen bg-canvas dark:bg-canvas-dark text-ink dark:text-ink-dark transition-colors duration-300">
          <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-screen mesh">
          <Login />
        </div>
      )}
    </>
  )
}

export default App
