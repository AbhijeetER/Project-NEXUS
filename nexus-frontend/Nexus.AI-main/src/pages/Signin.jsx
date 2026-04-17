import { Link } from "react-router-dom"
import { Boxes } from "../components/background-boxes"
export default function SignIn(){


    return(
      <div className="overflow-hidden min-h-screen w-full flex items-center justify-center bg-gray-900 relative">
        <Boxes />

  <div className="bg-gray-800/60 backdrop-blur-xl p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
    <h2 className="text-3xl font-semibold text-center text-white mb-8">Signin</h2>

    <form action="/signin" method="POST" className="space-y-6 z-10">
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-gray-300 text-sm">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter Email"
          required
          className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="text-gray-300 text-sm">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          placeholder="Enter Password"
          className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium"
      >
        Signin
      </button>

      <p className="text-center text-gray-400 text-sm">
        Don't have an account? <Link to="/signup" className="text-indigo-500 hover:underline">Signup</Link>
      </p>
    </form>
  </div>
</div>

    )
}