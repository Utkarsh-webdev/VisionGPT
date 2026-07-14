import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from "./Message";
import { toast } from 'react-hot-toast';

const STARTERS = [
  "Explain quantum computing simply",
  "Draft a friendly follow-up email",
  "A watercolor fox in a meadow",
  "Debug this: why is my loop infinite?",
];

const ChatBox = () => {

  const containerRef = useRef(null)

  const { selectedChat, user, axios, token, setUser } = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast('Login to send a message');
      if (!selectedChat) return toast('Start a new chat first');
      if (!prompt.trim()) return;

      setLoading(true);

      const promptCopy = prompt;
      setPrompt('');

      setMessages(prev => [
        ...prev,
        { role: 'user', content: promptCopy, timestamp: Date.now(), isImage: false }
      ])

      const { data } = await axios.post(`/api/message/${mode}`, {
        chatId: selectedChat._id,
        prompt: promptCopy,
        isPublished
      }, {
        headers: {
          Authorization: token,
        },
      })

      if (data.success) {
        setMessages(prev => [...prev, data.reply])
        if (mode === 'image') {
          setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        } else {
          setUser(prev => ({ ...prev, credits: prev.credits - 1 }))
        }
      } else {
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsPublished(false)
      setLoading(false)
    }
  };


  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, loading])

  return (
    <div className='flex-1 flex flex-col h-screen min-w-0'>

      {/* Chat Messages */}
      <div ref={containerRef} className='flex-1 overflow-y-auto scrollbar-none pt-16 md:pt-8 pb-4'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-6 px-6 text-center'>
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-2xl bg-brand-gradient animate-pulse-soft" />
              <svg viewBox="0 0 24 24" className="relative w-14 h-14 p-3.5 text-white" fill="currentColor">
                <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
              </svg>
            </div>
            <div>
              <p className='font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-ink-dark'>
                What are we making today?
              </p>
              <p className="mt-1.5 text-sm text-ink-dim dark:text-ink-dim-dark">
                Ask a question, write something, or generate an image.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="px-3.5 py-2 text-xs sm:text-sm rounded-full border border-[#E4E0F5] dark:border-[#2A2440] text-ink-dim dark:text-ink-dim-dark hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => <Message key={index} message={message} />)}

          {loading && (
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 shrink-0 rounded-full bg-brand-gradient flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white animate-spark" fill="currentColor">
                    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
                  </svg>
                </div>
                <div className='flex items-center gap-1.5 bg-surface dark:bg-surface-dark border border-[#E4E0F5] dark:border-[#2A2440] rounded-2xl rounded-bl-md px-4 py-3.5'>
                  <div className='w-1.5 h-1.5 rounded-full bg-ink-dim dark:bg-ink-dim-dark animate-bounce'></div>
                  <div className='w-1.5 h-1.5 rounded-full bg-ink-dim dark:bg-ink-dim-dark animate-bounce'></div>
                  <div className='w-1.5 h-1.5 rounded-full bg-ink-dim dark:bg-ink-dim-dark animate-bounce'></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="px-4 sm:px-6 pb-5 pt-2">
        <div className="max-w-3xl mx-auto">
          {mode === 'image' && (
            <label className='flex items-center gap-2 mb-2.5 text-xs text-ink-dim dark:text-ink-dim-dark w-fit mx-auto cursor-pointer select-none'>
              <input type='checkbox' className='accent-primary cursor-pointer w-3.5 h-3.5' checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)} />
              Publish this image to the Community gallery
            </label>
          )}

          <form onSubmit={onSubmit} className='flex items-center gap-2 bg-surface dark:bg-surface-dark border border-[#E4E0F5] dark:border-[#2A2440] focus-within:border-primary/50 rounded-full pl-1.5 pr-1.5 py-1.5 shadow-lg shadow-black/5 transition-colors'>

            <div className="flex items-center bg-surface-alt dark:bg-surface-alt-dark rounded-full p-1 shrink-0">
              {['text', 'image'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
                    mode === m
                      ? 'bg-surface dark:bg-surface-dark text-primary shadow-sm'
                      : 'text-ink-dim dark:text-ink-dim-dark'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <input
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              type='text'
              placeholder={mode === 'image' ? 'Describe the image to generate…' : 'Message QuickGPT…'}
              className='flex-1 min-w-0 text-sm bg-transparent outline-none px-2 text-ink dark:text-ink-dark placeholder-ink-dim dark:placeholder-ink-dim-dark'
            />

            <button
              disabled={loading || !prompt.trim()}
              className='shrink-0 w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all'
              aria-label="Send"
            >
              <img src={loading ? assets.stop_icon : assets.send_icon} className='w-4 h-4' alt='' />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
