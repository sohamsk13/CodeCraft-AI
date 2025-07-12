'use client'

import Link from 'next/link'
import { SignInForm } from '@/components/auth/signin-form'
import { Rocket, Code, Palette, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a20] via-[#1a1a40] to-[#2d2b65] overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 z-0" />

      {/* Floating Background Blobs */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full z-0" />
      <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full z-0" />

      {/* NAVBAR */}
      <nav className="relative z-10 flex justify-between items-center py-6 px-6 md:px-16">
        <div className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-purple-400" />
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodeCraft
          </span>
        </div>
        <Link
          href="/auth/signup"
          className="text-white/80 hover:text-white border border-white/20 px-4 py-2 rounded-full text-sm"
        >
          Sign Up
        </Link>
      </nav>

      {/* HERO + SIGNIN FORM */}
      <main className="relative z-10 container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Build Beautiful UIs
            </span>{' '}
            with AI-Powered Code Generation
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            CodeCraft helps developers & designers turn ideas into production-ready HTML/CSS using AI.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {[
              { icon: <Code className="text-purple-400" />, title: 'Clean Code' },
              { icon: <Palette className="text-pink-400" />, title: 'Custom Styling' },
              { icon: <Shield className="text-indigo-400" />, title: 'Secure & Private' },
              { icon: <Rocket className="text-yellow-400" />, title: 'Lightning Fast' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-lg border border-white/10">
                {item.icon}
                <span className="text-white/80">{item.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SignIn Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md mx-auto"
        >
          <SignInForm />
          <p className="mt-4 text-center text-white/70 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 text-white/60 text-sm text-center py-8 border-t border-white/10">
        © {new Date().getFullYear()} CodeCraft. All rights reserved.
      </footer>
    </div>
  )
}
