"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.ok) {
      router.push("/")
      router.refresh()
    } else {
      setError("Invalid credentials")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-md border border-gray-300 p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              required 
            />
          </div>
          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm font-medium hover:underline text-gray-600">Forgot Password?</Link>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded font-medium hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm border-t border-gray-200 pt-6">
          Need an account? <Link href="/auth/signup" className="font-semibold underline hover:text-gray-600">Register</Link>
        </div>
      </div>
    </div>
  )
}
