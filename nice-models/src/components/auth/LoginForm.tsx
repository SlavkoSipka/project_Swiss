'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to dashboard or home
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1 pl-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1 pl-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-3 pr-14 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowPassword((prev) => !prev)
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-medium text-pink-600 hover:text-pink-700 transition-colors cursor-pointer z-10"
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Forgot Password */}
      <div className="text-right pt-1">
        <a href="/forgot-password" className="text-xs text-pink-600 hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white py-2.5 rounded font-semibold hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4"
      >
        {loading ? 'Logging in...' : 'LOGIN'}
      </button>
    </form>
  )
}

