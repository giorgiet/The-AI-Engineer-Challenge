'use client'

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      return
    }

    setLoading(true)
    setError('')
    setResponse('')

    try {
      // Clean the message before sending
      const cleanMessage = message.trim()
      
      if (!cleanMessage) {
        setError('Please enter a message')
        setLoading(false)
        return
      }

      // Use relative URL in production (same domain), absolute URL in development
      const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : process.env.NEXT_PUBLIC_BACKEND_URL || ''
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: cleanMessage }),
      })

      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`
        try {
          const errorData = await res.json()
          // Handle validation errors
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join('. ')
          } else if (errorData.detail) {
            // Handle single detail or array of details
            if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((d: any) => d.msg || JSON.stringify(d)).join('. ')
            } else {
              errorMessage = errorData.detail
            }
          }
        } catch {
          // If response isn't JSON, use status text
          errorMessage = res.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await res.json()
      setResponse(data.reply || 'No response received')
      setMessage('')
    } catch (err) {
      let errorMessage = 'Failed to get response'
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Cannot connect to backend. Make sure the FastAPI server is running on http://localhost:8000'
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">AI Chat Assistant</h1>
          <p className="text-gray-400">Powered by Giorgiet</p>
        </div>

        {/* Chat Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Response Area */}
        {response && (
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-3">Response:</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {response}
              </p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <p className="text-gray-400">Waiting for response...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

