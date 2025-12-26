import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
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

        {/* Login Form Card */}
        <div className="glass rounded-3xl shadow-2xl p-8 backdrop-blur-xl animate-scale-in">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-6 text-sm leading-relaxed">
            If you have a user account with us, please log in.
          </p>
          
          <LoginForm />

          {/* New Customers Section - kao and6.com */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-3">
              New customers
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
              Create your personal account within a minute. Simply choose a username and password and your registration is complete. After successful login, you can use all the available functions.
            </p>
            <Link
              href="/register"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-medium"
            >
              Create user account
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-300 space-x-4">
          <Link href="/forgot-password" className="hover:text-pink-400 transition-colors font-medium">
            Forgot Password?
          </Link>
          <span className="text-gray-500">•</span>
          <Link href="/help" className="hover:text-pink-400 transition-colors font-medium">
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  )
}

