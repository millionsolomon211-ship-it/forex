"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Signup() {
  const router = useRouter()
  const [role, setRole] = useState("USER") // USER, BANK, PRIVATE
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Forex Specific fields
  const [companyName, setCompanyName] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const payload = {
      name, email, password, role,
      ...((role === "BANK" || role === "PRIVATE") && { companyName, registrationNumber })
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        if (data.redirectUrl) {
          router.push(data.redirectUrl)
        } else {
          router.push("/auth/login?registered=true")
        }
      } else {
        setError(data.error || "Failed to register")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-xl border border-gray-300 p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-semibold mb-6 text-center">Create an Account</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm">Account Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="USER" checked={role === "USER"} onChange={() => setRole("USER")} className="accent-black"/>
                Traveler
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="BANK" checked={role === "BANK"} onChange={() => setRole("BANK")} className="accent-black"/>
                Bank
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" value="PRIVATE" checked={role === "PRIVATE"} onChange={() => setRole("PRIVATE")} className="accent-black"/>
                Private Forex
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              required 
            />
          </div>

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

          {(role === "BANK" || role === "PRIVATE") && (
            <div className="border border-gray-200 p-4 rounded bg-gray-50 flex flex-col gap-4 mt-2">
              <p className="text-sm font-medium text-gray-700">Forex Provider Details</p>
              <div>
                <label className="block text-sm font-medium mb-1">Institution Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration/License Number</label>
                <input 
                  type="text" 
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
                  required 
                />
              </div>
              <p className="text-xs text-gray-500">Note: Providers must wait for admin authorization before setting rates.</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-3 rounded font-medium hover:bg-gray-800 transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          Already have an account? <Link href="/auth/login" className="font-semibold underline hover:text-gray-600">Log in</Link>
        </div>
      </div>
    </div>
  )
}
