import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";
import logo_full from "../assets/logo_full.jpg";
import logo_full_dark from "../assets/logo_full_dark.png";
import toast from "react-hot-toast";

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "U";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    selectedChat,
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredChats = (chats || []).filter((chat) =>
    chat.messages[0]
      ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase())
      : chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`flex flex-col h-screen w-72 shrink-0 p-4
        bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-2xl
        border-r border-[#E4E0F5] dark:border-[#2A2440]/60
        transition-transform duration-300 ease-in-out
        max-md:fixed max-md:inset-y-0 max-md:z-50 max-md:w-[280px]
        ${!isMenuOpen ? "max-md:-translate-x-full" : "max-md:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-1 mb-5">
          <img
            src={theme === "dark" ? logo_full : logo_full_dark}
            alt="QuickGPT"
            className="w-32"
          />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-surface-alt dark:hover:bg-surface-alt-dark"
            aria-label="Close menu"
          >
            <img src={assets.close_icon} className="w-4 h-4 not-dark:invert opacity-70" alt="" />
          </button>
        </div>



        {/* Recent Chats */}
        {filteredChats.length > 0 && (
          <p className="mt-5 mb-2 px-1 text-[11px] font-semibold text-ink-dim dark:text-ink-dim-dark uppercase tracking-wider">
            Recent
          </p>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-none space-y-1 -mx-1 px-1">
          {filteredChats.map((chat) => {
            const active = selectedChat?._id === chat._id;
            return (
              <div
                onClick={() => {
                  navigate("/");
                  setSelectedChat(chat);
                  setIsMenuOpen(false);
                }}
                key={chat._id}
                className={`group flex justify-between items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors
                ${active
                  ? "bg-primary/10 dark:bg-primary/15"
                  : "hover:bg-surface-alt dark:hover:bg-surface-alt-dark"}`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`truncate text-sm ${active ? "font-medium text-primary" : "text-ink dark:text-ink-dark"}`}>
                    {chat.messages.length > 0
                      ? chat.messages[0].content.slice(0, 32)
                      : chat.name}
                  </p>
                  <p className="text-xs text-ink-dim dark:text-ink-dim-dark mt-0.5">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>

                <button
                  onClick={(e) =>
                    toast.promise(deleteChat(e, chat._id), {
                      loading: "Deleting…",
                      success: "Chat deleted",
                      error: (err) => err?.message || "Couldn't delete chat",
                    })
                  }
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-danger/10 transition-all shrink-0"
                  aria-label="Delete chat"
                >
                  <img src={assets.bin_icon} className="w-3.5 not-dark:invert" alt="" />
                </button>
              </div>
            );
          })}

          {filteredChats.length === 0 && search && (
            <p className="px-1 py-4 text-sm text-ink-dim dark:text-ink-dim-dark text-center">
              No chats match “{search}”
            </p>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="space-y-1.5 pt-3 mt-2 border-t border-[#E4E0F5] dark:border-[#2A2440]/60">
          <button
            onClick={() => {
              navigate("/community");
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark transition-colors text-left"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-accent-blue/10 rounded-lg shrink-0">
              <img src={assets.gallery_icon} className="w-4 not-dark:invert" alt="" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink dark:text-ink-dark">Community</p>
              <p className="text-xs text-ink-dim dark:text-ink-dim-dark truncate">Explore shared images</p>
            </div>
          </button>

          <button
            onClick={() => {
              navigate("/credits");
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-surface-alt dark:hover:bg-surface-alt-dark transition-colors text-left"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-accent-gold/15 rounded-lg shrink-0">
              <img src={assets.diamond_icon} className="w-4" alt="" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink dark:text-ink-dark">
                {user?.credits ?? 0} credits
              </p>
              <p className="text-xs text-ink-dim dark:text-ink-dim-dark truncate">Buy more credits</p>
            </div>
          </button>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-surface-alt dark:bg-surface-alt-dark rounded-lg shrink-0">
                <img src={assets.theme_icon} className="w-4 not-dark:invert" alt="" />
              </div>
              <span className="text-sm font-medium text-ink dark:text-ink-dark">Dark mode</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-[#DDD8F0] dark:bg-[#332C55] peer-checked:bg-primary rounded-full transition-colors" />
              <span className="absolute left-0.5 top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transform peer-checked:translate-x-4.5 transition-transform" />
            </label>
          </div>

          {/* User Account */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-alt dark:bg-surface-alt-dark">
            <div className="w-9 h-9 shrink-0 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-semibold">
              {initials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">
                {user ? user.name : "Guest"}
              </p>
              <p className="text-xs text-ink-dim dark:text-ink-dim-dark truncate">
                {user ? user.email : "Not logged in"}
              </p>
            </div>
            {user && (
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark transition-colors shrink-0"
                title="Logout"
              >
                <img src={assets.logout_icon} className="w-4 not-dark:invert" alt="Logout" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
