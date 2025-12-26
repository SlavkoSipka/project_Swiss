'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
// Removed unused imports

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'model' | 'company',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!termsAccepted || !privacyAccepted) {
      setError('You must accept the terms and conditions and privacy policy')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            role: formData.role,
          },
        },
      })

      if (authError) {
        // Detaljno logovanje za debugging
        console.error('=== AUTH ERROR ===')
        console.error('Message:', authError.message)
        console.error('Status:', authError.status)
        console.error('Name:', authError.name)
        console.error('Full error:', JSON.stringify(authError, null, 2))
        
        // Prikaži tačnu grešku korisniku
        const errorMessage = authError.message || 'Failed to create account. Please check console for details.'
        
        setError(errorMessage)
        setLoading(false)
        return
      }

      // Proveri da li je user kreiran (može biti null ako je email confirmation uključen)
      if (!authData.user) {
        // Email confirmation je uključen - korisnik mora da potvrdi email
        // Profil će biti kreiran kada korisnik potvrdi email (preko auth callback)
        setError('Registration successful! Please check your email to confirm your account before logging in.')
        setLoading(false)
        return
      }

      // Proveri da li profil već postoji (možda je kreiran automatski preko triggera)
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single()

      // Ako profil ne postoji, kreiraj ga
      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: formData.username,
            email: formData.email,
            role: formData.role,
            profile_status: 'pending',
          })

        if (profileError) {
          console.error('Profile creation error details:', {
            message: profileError.message,
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint,
          })
          
          // Ako je greška zbog već postojećeg profila (race condition), pokušaj da ažuriraš
          if (profileError.code === '23505') { // unique_violation
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                username: formData.username,
                role: formData.role,
              })
              .eq('id', authData.user.id)
            
            if (updateError) {
              console.error('Profile update error:', updateError)
              setError('Failed to create profile. Please try logging in.')
              setLoading(false)
              return
            }
          } else {
            // Detaljnija greška
            setError(profileError.message || 'Failed to create profile. Please try logging in.')
            setLoading(false)
            return
          }
        }
      } else {
        // Profil već postoji (kreiran automatski), samo ažuriraj username i role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: formData.username,
            role: formData.role,
          })
          .eq('id', authData.user.id)
        
        if (updateError) {
          console.error('Profile update error:', updateError)
          // Ne prekidaj registraciju, samo loguj grešku
        }
      }

      // Redirect based on role
      if (formData.role === 'model') {
        // Models go to multi-step registration wizard
        router.push('/register/model')
      } else {
        // Regular users and companies go to login
        router.push('/login?registered=true')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      // Detaljnija error poruka
      const errorMessage = err.message || 
        (err.error?.message) || 
        (typeof err === 'string' ? err : 'Database error saving new user. Please check console for details.')
      setError(errorMessage)
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

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1 pl-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="Create username"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1 pl-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          placeholder="you@example.com"
        />
      </div>

      {/* Role Selection - Radio Buttons kao and6.com */}
      <div className="space-y-2">
        <label className="flex items-center p-2 border-2 rounded cursor-pointer transition hover:border-pink-300">
          <input
            type="radio"
            name="role"
            value="user"
            checked={formData.role === 'user'}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'model' | 'company' })}
            className="w-4 h-4 text-pink-600 focus:ring-pink-500"
          />
          <span className="ml-2 text-sm text-gray-700 font-medium">Member</span>
        </label>
        
        <label className="flex items-center p-2 border-2 rounded cursor-pointer transition hover:border-pink-300">
          <input
            type="radio"
            name="role"
            value="model"
            checked={formData.role === 'model'}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'model' | 'company' })}
            className="w-4 h-4 text-pink-600 focus:ring-pink-500"
          />
          <span className="ml-2 text-sm text-gray-700 font-medium">Independent Escort / Private Girl</span>
        </label>
        
        <label className="flex items-center p-2 border-2 rounded cursor-pointer transition hover:border-pink-300">
          <input
            type="radio"
            name="role"
            value="company"
            checked={formData.role === 'company'}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'model' | 'company' })}
            className="w-4 h-4 text-pink-600 focus:ring-pink-500"
          />
          <span className="ml-2 text-sm text-gray-700 font-medium">Escort Agency / Club</span>
        </label>
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
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="new-password"
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

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1 pl-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            autoComplete="new-password"
            className="w-full px-3 pr-14 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Confirm password"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowConfirmPassword((prev) => !prev)
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-medium text-pink-600 hover:text-pink-700 transition-colors cursor-pointer z-10"
            tabIndex={-1}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Terms & Privacy - kao and6.com */}
      <div className="space-y-1.5">
        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 flex-shrink-0"
          />
          <span className="ml-2 text-xs text-gray-700 leading-tight">
            I have read and I agree with the general{' '}
            <a href="/terms" className="text-pink-600 hover:underline">terms & conditions</a>
            {' '}and{' '}
            <a href="/consent" className="text-pink-600 hover:underline">Consent Policy</a>
          </span>
        </label>
        
        <label className="flex items-start cursor-pointer group">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 flex-shrink-0"
          />
          <span className="ml-2 text-xs text-gray-700 leading-tight">
            I have read and accepted the{' '}
            <a href="/privacy" className="text-pink-600 hover:underline">privacy policy</a>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-pink-600 text-white py-2.5 rounded font-semibold hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4"
      >
        {loading ? 'Creating Account...' : 'REGISTER'}
      </button>
    </form>
  )
}

