import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const { axios } = useAppContext()

  const fetchImages = async () => {
    try {
      const { data } = await axios.get('/api/user/published-images')
      if (data.success) {
        setImages(data.images)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Loading />

  return (
    <div className='flex-1 h-screen overflow-y-auto scrollbar-none px-4 sm:px-6 lg:px-10 py-10'>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-semibold tracking-wider uppercase text-primary">Gallery</p>
          <h1 className='mt-2 font-display text-3xl font-semibold text-ink dark:text-ink-dark'>
            Community creations
          </h1>
          <p className="mt-1.5 text-sm text-ink-dim dark:text-ink-dim-dark">
            Images generated and shared by the QuickGPT community.
          </p>
        </div>

        {images.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {images.map((item, index) => (
              <a
                key={index}
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="relative group block mb-4 break-inside-avoid rounded-2xl overflow-hidden border border-[#E4E0F5] dark:border-[#2A2440] shadow-sm hover:shadow-lg transition-shadow animate-fade-up"
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-xs text-white font-medium">
                    by {item.userName}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-[#E4E0F5] dark:border-[#2A2440] rounded-2xl">
            <p className="text-ink dark:text-ink-dark font-medium">Nothing published yet</p>
            <p className="text-sm text-ink-dim dark:text-ink-dim-dark mt-1">
              Generate an image and publish it to be the first here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
