import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { assets, showcaseImages } from '../assets/assets';

const Login = () => {

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { axios, setToken } = useAppContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = state === "login" ? "/api/user/login" : "/api/user/register";

    try {
      setSubmitting(true);
      const { data } = await axios.post(url, { name, email, password });
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token);
        toast.success(state === "login" ? "Welcome back" : "Account created");
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Brand panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
          <img src={assets.logo_full} alt="QuickGPT" className="w-40" />
        </div>

        <div className="relative z-10 max-w-md animate-fade-up">
          <p className="font-display text-4xl font-semibold text-white leading-tight">
            Think it. <span className="text-gradient">Type it.</span><br />See it made.
          </p>
          <p className="mt-4 text-[#C9C3E8] text-sm leading-relaxed">
            One conversation for answers, code, and full-resolution AI art —
            generated in seconds and yours to keep or share.
          </p>
        </div>

        {/* Showcase collage */}
        <div className="relative z-10 grid grid-cols-4 gap-2.5 max-w-md">
          {showcaseImages.slice(0, 8).map((img, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl overflow-hidden ring-1 ring-white/10 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 mesh" />
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-canvas dark:bg-canvas-dark">
        <form onSubmit={handleSubmit} className="w-full max-w-sm animate-fade-up">

          <div className="lg:hidden mb-8 flex justify-center">
            <img src={assets.logo_full_dark} alt="QuickGPT" className="w-36" />
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
            {state === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-ink-dim dark:text-ink-dim-dark">
            {state === "login"
              ? "Log in to pick up your conversations."
              : "Start with 20 free credits, no card required."}
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {state === "register" && (
              <div>
                <label className="text-sm font-medium text-ink dark:text-ink-dark">Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Ada Lovelace"
                  className="mt-1.5 w-full rounded-xl border border-[#E4E0F5] dark:border-[#2A2440] bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                  type="text"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-ink dark:text-ink-dark">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-[#E4E0F5] dark:border-[#2A2440] bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink dark:text-ink-dark">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-[#E4E0F5] dark:border-[#2A2440] bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                type="password"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-brand-gradient text-white text-sm font-medium py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {submitting ? "Please wait…" : state === "register" ? "Create account" : "Log in"}
          </button>

          <p className="mt-6 text-center text-sm text-ink-dim dark:text-ink-dim-dark">
            {state === "register" ? "Already have an account?" : "New to QuickGPT?"}{" "}
            <button
              type="button"
              onClick={() => setState(state === "login" ? "register" : "login")}
              className="text-primary font-medium hover:underline"
            >
              {state === "register" ? "Log in" : "Create one"}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
