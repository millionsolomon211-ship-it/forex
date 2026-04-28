"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")

  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [emailParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess("Email verified successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        setError(data.error || "Failed to verify OTP")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-md border border-gray-300 p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-semibold mb-2 text-center">Verify Email</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Enter the 6-digit OTP sent to your email.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm border border-green-200">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              required 
              readOnly={!!emailParam}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">6-Digit OTP</label>
            <input 
              type="text" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="123456"
              maxLength={6}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-center tracking-[0.5em] font-mono text-lg"
              required 
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded font-medium hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  )
}
