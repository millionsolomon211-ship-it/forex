"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenParam = searchParams.get("token")
  const emailParam = searchParams.get("email")

  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (emailParam) setEmail(emailParam)
    if (tokenParam) setToken(tokenParam)
  }, [emailParam, tokenParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!token || !email) {
      setError("Missing reset token or email address in the URL link.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess("Password reset successfully! Redirecting to login...")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        setError(data.error || "Failed to reset password")
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
        <h1 className="text-3xl font-semibold mb-2 text-center">Reset Password</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Enter your new password below.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm border border-green-200">{success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-gray-50 cursor-not-allowed"
              required 
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              required 
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded font-medium hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm border-t border-gray-200 pt-6">
          <Link href="/auth/login" className="font-semibold underline hover:text-gray-600">Back to log in</Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-white text-black">
        <div className="text-center font-medium">Loading reset form...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
