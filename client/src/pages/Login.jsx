import React, { useState } from 'react'

const Login = () => {

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-600 rounded-xl shadow-lg border border-gray-200 bg-white">
      
      {/* Title */}
      <p className="text-2xl font-semibold m-auto">
        <span className="text-purple-500">User</span>{" "}
        {state === "login" ? "Login" : "Sign Up"}
      </p>

      {/* Name field (only in register) */}
      {state === "register" && (
        <div className="w-full">
          <p className="text-sm font-medium">Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Type here"
            className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            required
          />
        </div>
      )}

      {/* Email field */}
      <div className="w-full">
        <p className="text-sm font-medium">Email</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Type here"
          className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
          type="email"
          required
        />
      </div>

      {/* Password field */}
      <div className="w-full">
        <p className="text-sm font-medium">Password</p>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Type here"
          className="border border-gray-300 rounded-md w-full p-2 mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
          type="password"
          required
        />
      </div>

      {/* Switch between login / register */}
      {state === "register" ? (
        <p className="text-sm">
          Already have an account?{" "}
          <span
            onClick={() => setState("login")}
            className="text-purple-500 cursor-pointer font-medium hover:underline"
          >
            Click here
          </span>
        </p>
      ) : (
        <p className="text-sm">
          Create an account?{" "}
          <span
            onClick={() => setState("register")}
            className="text-purple-500 cursor-pointer font-medium hover:underline"
          >
            Click here
          </span>
        </p>
      )}

      {/* Submit button */}
      <button type='submit' className="bg-purple-500 hover:bg-purple-600 transition-all text-white w-full py-2 rounded-md font-medium mt-2">
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  )
}

export default Login
