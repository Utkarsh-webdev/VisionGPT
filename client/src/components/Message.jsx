import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({ message }) => {

  useEffect(() => {
    Prism.highlightAll()
  }, [message.content])

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {message.role === "user" ? (
        <div className="flex items-start justify-end gap-3 mb-6 group animate-fade-up">
          <div className="flex flex-col items-end max-w-[80%]">
            <div className="bg-brand-gradient text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md shadow-primary/10">
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
            </div>
            <span className="text-xs text-ink-dim dark:text-ink-dim-dark mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden ring-2 ring-surface dark:ring-surface-dark shadow-sm">
            <img src={assets.user_icon} className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 mb-6 group animate-fade-up">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
              <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 max-w-[80%]">
            {message.isImage ? (
              <div className="bg-surface dark:bg-surface-dark rounded-2xl rounded-bl-md p-2 shadow-sm border border-[#E4E0F5] dark:border-[#2A2440] inline-block">
                <img
                  src={message.content}
                  alt="AI generated"
                  className="w-full max-w-md rounded-lg"
                />
              </div>
            ) : (
              <div className="bg-surface dark:bg-surface-dark rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[#E4E0F5] dark:border-[#2A2440]">
                <div className="text-sm text-ink dark:text-ink-dark leading-relaxed reset-tw">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            )}
            <span className="text-xs text-ink-dim dark:text-ink-dim-dark mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity block">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Message
