'use client'

import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Download, Copy, Code, Eye, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { CodeBlock } from './code-block'
import { PreviewPane } from './preview-pane'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  htmlCode?: string
  cssCode?: string
  timestamp: Date
}

interface ChatInterfaceProps {
  userId: string
}

const ChatMessage = memo(({
  message,
  onPreview,
  onCopy,
  onDownload
}: {
  message: Message
  onPreview: (html: string, css?: string) => void
  onCopy: (text: string) => void
  onDownload: (html: string, css?: string) => void
}) => (
  <motion.div
    key={message.id}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`max-w-[85%] ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
      <Card className={`rounded-2xl ${message.role === 'user' ? 'bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30' : 'bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30'} border backdrop-blur-lg`}>
        <CardHeader className="pb-2 flex flex-row justify-between items-center space-y-0">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`rounded-full ${message.role === 'user' ? 'bg-blue-500/20 border-blue-500/50 text-blue-200' : 'bg-purple-500/20 border-purple-500/50 text-purple-200'}`}
            >
              {message.role === 'user' ? 'You' : 'AI'}
            </Badge>
            <span className="text-xs text-muted-foreground/70">{message.timestamp.toLocaleTimeString()}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="whitespace-pre-wrap text-sm text-white/90">{message.content}</p>
          {message.htmlCode && (
            <>
              <Separator className="my-3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white/80">Generated Code</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onPreview(message.htmlCode!, message.cssCode)}
                      className="bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/80 hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onCopy(message.htmlCode!)}
                      className="bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/80 hover:text-white"
                    >
                      <Copy className="w-4 h-4 mr-1.5" /> Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onDownload(message.htmlCode!, message.cssCode)}
                      className="bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/80 hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-1.5" /> Download
                    </Button>
                  </div>
                </div>
                <CodeBlock code={message.htmlCode} language="html" />
                {message.cssCode && <CodeBlock code={message.cssCode} language="css" />}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  </motion.div>
))

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPreview, setCurrentPreview] = useState<{ html: string; css?: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isFocused])

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus()
  }, [isLoading])

  const downloadHTML = useCallback((html: string, css?: string) => {
    const fullHtml = css ? html.replace('</head>', `<style>${css}</style></head>`) : html
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-${Date.now()}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded!', {
      position: 'top-center',
      style: {
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        backdropFilter: 'blur(10px)'
      }
    })
  }, [])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied!', {
      position: 'top-center',
      style: {
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        backdropFilter: 'blur(10px)'
      }
    })
  }, [])

  const handlePreview = useCallback((html: string, css?: string) => {
    setCurrentPreview({ html, css })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(msgs => [...msgs, newMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          chatHistory: [...messages, newMsg].map(m => ({ role: m.role, content: m.content }))
        })
      })
      if (!res.ok) throw new Error('AI response failed')

      const data = await res.json()
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        htmlCode: data.htmlCode,
        cssCode: data.cssCode,
        timestamp: new Date()
      }

      setMessages(msgs => [...msgs, aiMsg])
      setTimeout(() => {
        data.htmlCode && setCurrentPreview({ html: data.htmlCode, css: data.cssCode })
      }, 50)
    } catch {
      toast.error('Failed to get AI response.', {
        position: 'top-center',
        style: {
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 0, 0, 0.2)',
          color: 'white',
          backdropFilter: 'blur(10px)'
        }
      })
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0e1a] via-[#131a2b] to-[#0a0e1a] text-white overflow-hidden">
      {/* Chat Panel */}
      <div className="flex w-1/2 flex-col border-r border-white/5 backdrop-blur-lg bg-black/30">
        <div className="p-5 flex items-center gap-3 border-b border-white/5 bg-gradient-to-r from-[#1e2747] to-[#151d35]">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">AI Code Generator</h1>
            <p className="text-xs text-white/60">Describe what you need and get HTML/CSS code instantly</p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map(msg => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onPreview={handlePreview}
                  onCopy={copyToClipboard}
                  onDownload={downloadHTML}
                />
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex justify-center py-8"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-purple-500/50 border-t-purple-500 animate-spin" />
                  <p className="text-purple-300 text-sm font-medium">
                    Generating magic...
                  </p>
                </div>
              </motion.div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <form 
          onSubmit={handleSubmit} 
          className="p-5 pt-3 bg-gradient-to-t from-[#151d35] to-transparent border-t border-white/5"
        >
          <div className="relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe the HTML/CSS you'd like (e.g. 'A modern login form with gradient background')"
              className="flex-1 bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30 transition rounded-xl resize-none pr-12 backdrop-blur-md"
              rows={2}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e)
              }}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading} 
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Panel */}
      <div className="w-1/2 flex flex-col bg-gradient-to-br from-[#0a0e1a] via-[#131a2b] to-[#0a0e1a]">
        <div className="p-5 flex items-center gap-3 border-b border-white/5 bg-gradient-to-r from-[#1e2747] to-[#151d35]">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Live Preview</h2>
            <p className="text-xs text-white/60">See your generated code come to life</p>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 bg-black/10 backdrop-blur-sm">
          <div className="h-full rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0f1424] to-[#0a0e1a] shadow-lg">
            <PreviewPane html={currentPreview?.html} css={currentPreview?.css} />
          </div>
        </div>
      </div>
    </div>
  )
}