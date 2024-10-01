import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Send, Image as ImageIcon, ArrowLeft } from 'lucide-react'
import { API_URL } from '../config'
import ReactMarkdown from 'react-markdown'

interface ToolInterfaceProps {
  toolName: string
  onBack: () => void
}

const ToolInterface: React.FC<ToolInterfaceProps> = ({ toolName, onBack }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; type: 'text' | 'image' }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isImageTool = toolName === 'DALL-E' || toolName === 'Stable Diffusion'

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = { role: 'user' as const, content: input, type: 'text' as const };
      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toolName: toolName,
            messages: [...messages, newMessage].map(msg => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (isImageTool && data.image) {
          const imageUrl = `data:image/png;base64,${data.image}`;
          setMessages(prev => [...prev, { role: 'ai', content: imageUrl, type: 'image' }]);
        } else {
          setMessages(prev => [...prev, { role: 'ai', content: data.response, type: 'text' }]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error.', type: 'text' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{toolName}</h1>
      </header>
      <ScrollArea className="flex-grow p-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {message.type === 'text' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  <img src={message.content} alt="Generated image" className="max-w-full h-auto rounded" />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 bg-gray-800">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isImageTool ? "Describe the image you want to generate..." : "Type your message..."}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? (
              "Sending..."
            ) : isImageTool ? (
              <ImageIcon className="h-5 w-5" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ToolInterface