import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateHTMLCSS } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { message, chatHistory } = await req.json()

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      )
    }

    // Generate HTML/CSS using Gemini AI
    const aiResponse = await generateHTMLCSS(message, chatHistory)
    
    // Extract HTML and CSS from the response
    const htmlMatch = aiResponse.match(/```html\n([\s\S]*?)```/)
    const cssMatch = aiResponse.match(/```css\n([\s\S]*?)```/)
    
    const htmlCode = htmlMatch ? htmlMatch[1].trim() : ''
    const cssCode = cssMatch ? cssMatch[1].trim() : ''

    // Save to database
    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        prompt: message,
        response: aiResponse,
        htmlCode,
        cssCode
      }
    })

    return NextResponse.json({
      response: aiResponse,
      htmlCode,
      cssCode,
      chatId: chat.id
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}