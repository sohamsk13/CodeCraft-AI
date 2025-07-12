'use client'

import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'

interface PreviewPaneProps {
  html?: string
  css?: string
}

export function PreviewPane({ html, css }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (html && iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (doc) {
        let fullHTML = html
        
        // If CSS is provided separately, inject it
        if (css && !html.includes('<style>')) {
          fullHTML = html.replace('</head>', `<style>${css}</style></head>`)
        }
        
        // If no head tag exists, create a basic HTML structure
        if (!html.includes('<head>')) {
          fullHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview</title>
              ${css ? `<style>${css}</style>` : ''}
            </head>
            <body>
              ${html}
            </body>
            </html>
          `
        }
        
        doc.open()
        doc.write(fullHTML)
        doc.close()
      }
    }
  }, [html, css])

  return (
    <Card className="h-full bg-black/20 border-white/10 backdrop-blur-md">
      <div className="p-4 h-full">
        {html ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 rounded-lg bg-white"
            sandbox="allow-scripts allow-same-origin"
            title="HTML Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/50">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg">Start chatting to see your generated HTML/CSS here!</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}