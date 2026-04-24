"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.ok) {
      router.push("/dashboard")
      router.refresh()
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md border-8 border-black p-8 bg-white shadow-[12px_12px_0_0_#000]">
        <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-2">System Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xl font-bold uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-4 border-black p-4 text-lg font-bold bg-gray-100 focus:bg-white outline-none focus:ring-4 focus:ring-black"
              required 
            />
          </div>
          <div>
            <label className="block text-xl font-bold uppercase mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-4 border-black p-4 text-lg font-bold bg-gray-100 focus:bg-white outline-none focus:ring-4 focus:ring-black"
              required 
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-black text-white text-2xl font-black uppercase p-4 border-4 border-black hover:bg-white hover:text-black transition-colors mt-4"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  )
}
