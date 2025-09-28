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
      <div className="max-w-4xl mx-auto">
        {message.role === "user" ? (
          <div className="flex items-start justify-end gap-3 mb-6 group">
            <div className="flex flex-col items-end max-w-[80%]">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg">
                <p className="text-sm leading-relaxed break-words">{message.content}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {moment(message.timestamp).fromNow()}
              </span>
            </div>
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-800">
              <span className="text-white text-xs font-bold">
                <img src={assets.user_icon} />
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 mb-6 group">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-800">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="flex-1 max-w-[80%]">
              {message.isImage ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                  <img 
                    src={message.content} 
                    alt="AI Generated" 
                    className="w-full max-w-md rounded-lg shadow-sm" 
                  />
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed reset-tw">
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity block">
                {moment(message.timestamp).fromNow()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Message