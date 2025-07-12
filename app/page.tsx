import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ChatInterface } from '@/components/chat/chat-interface'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { SignOutButton } from '@/components/SignOutButton'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="absolute top-0 right-0 z-50 p-4">
        <div className="flex items-center gap-2">
          <SignOutButton />
        </div>
      </header>

      {/* Main Chat Interface */}
      <ChatInterface userId={session.user.id} />
    </div>
  )
}