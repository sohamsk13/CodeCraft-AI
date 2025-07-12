import Link from 'next/link'
import { SignUpForm } from '@/components/auth/signup-form'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <SignUpForm />
        <p className="mt-6 text-center text-white/70">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}