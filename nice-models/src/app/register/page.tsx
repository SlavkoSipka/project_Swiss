import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-black flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-white">
                Nice<span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Models</span>
              </span>
            </h1>
            <p className="text-gray-300 mt-2 text-sm uppercase tracking-widest">DAS EROTIKPORTAL</p>
          </Link>
        </div>

        {/* Register Form Card */}
        <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl animate-scale-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-center text-gray-600 mb-6 text-sm leading-relaxed">
            Create your account and get started today.
          </p>
          <RegisterForm />

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-600 hover:text-pink-700 font-bold hover:underline">
              Login here
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-4 text-xs text-center text-gray-500 leading-relaxed">
            By registering, you agree to our{' '}
            <Link href="/terms" className="text-pink-600 hover:underline font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-pink-600 hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

