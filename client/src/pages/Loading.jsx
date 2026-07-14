import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/')
    }, 8000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='mesh flex flex-col items-center justify-center gap-4 h-screen w-screen text-white'>
      <svg viewBox="0 0 24 24" className="w-9 h-9 animate-spark" fill="currentColor">
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
      </svg>
      <p className="text-sm text-[#C9C3E8]">Getting things ready…</p>
    </div>
  )
}

export default Loading
