import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    axios,
    setChats,
    fetchUserChats,
    setToken,
    token,
  } = useAppContext();
  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully");
  };

  const deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation();
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this chat?"
      );
      if (!confirmDelete) return;
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: token } }
      );
      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUserChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-80 p-6 
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl
      border-r border-gray-200/60 dark:border-purple-500/20
      transition-all duration-500 ease-in-out
      max-md:fixed max-md:inset-y-0 max-md:z-50 max-md:w-80
      ${!isMenuOpen ? "max-md:-translate-x-full" : "max-md:translate-x-0"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <img
          src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
          alt="QuickGPT"
          className="w-40"
        />
        <img
          onClick={() => setIsMenuOpen(false)}
          src={assets.close_icon}
          className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity md:hidden not-dark:invert"
          alt="Close menu"
        />
      </div>

      {/* New Chat Button */}
      <button
        onClick={createNewChat}
        className="flex items-center justify-center w-full py-3.5 px-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <span className="mr-3 text-lg">+</span> New Chat
      </button>

      {/* Search */}
      <div className="flex items-center gap-3 p-3 mt-6 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl backdrop-blur-sm">
        <img
          src={assets.search_icon}
          className="w-4 opacity-60 not-dark:invert"
          alt="Search"
        />
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          value={search}
          placeholder="Search conversations..."
          className="flex-1 text-sm bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Recent Chats */}
      {chats && chats.length > 0 && (
        <p className="mt-6 mb-3 text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Recent Chats
        </p>
      )}

      <div className="flex-1 overflow-y-auto space-y-2">
        {(chats || [])
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              key={chat._id}
              className="group flex justify-between items-center p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-purple-500/10 rounded-xl cursor-pointer hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-purple-500/20 transition-all duration-200 backdrop-blur-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-gray-900 dark:text-white text-sm">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) =>
                  toast.promise(deleteChat(e, chat._id), {
                    loading: "Deleting...",
                  })
                }
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
              >
                <img
                  src={assets.bin_icon}
                  className="w-4 cursor-pointer not-dark:invert"
                  alt="Delete chat"
                />
              </button>
            </div>
          ))}
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        {/* Community */}
        <div
          onClick={() => {
            navigate("/community");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
        >
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
            <img src={assets.gallery_icon} className="w-4 not-dark:invert" alt="" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Community
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Explore shared images
            </p>
          </div>
        </div>

        {/* Credits */}
        <div
          onClick={() => {
            navigate("/credits");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
        >
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
            <img src={assets.diamond_icon} className="w-4 dark:invert" alt="" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Credits:{" "}
              <span className="text-purple-600 dark:text-purple-400">
                {user?.credit || 0}
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Purchase more credits
            </p>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <img src={assets.theme_icon} className="w-4 not-dark:invert" alt="" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Dark Mode
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer-checked:bg-purple-600 transition-colors"></div>
            <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></span>
          </label>
        </div>

        {/* User Account */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
          <img
            src={assets.user_icon}
            className="w-10 h-10 rounded-full border-2 border-purple-500/20"
            alt=""
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user ? user.name : "Guest User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user ? user.email : "Login to continue"}
            </p>
          </div>
          {user && (
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Logout"
            >
              <img
                src={assets.logout_icon}
                className="w-4 not-dark:invert"
                alt="Logout"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
