import { MessageSquare, Image as ImageIcon, Code, Music, Video } from 'lucide-react'

export const aiTools = [
  { 
    id: 1, 
    name: "ChatGPT", 
    category: "Text", 
    icons: [MessageSquare, MessageSquare, MessageSquare],
    description: "Advanced language model for natural conversations and text generation."
  },
  { 
    id: 2, 
    name: "DALL-E", 
    category: "Image", 
    icons: [ImageIcon, ImageIcon, ImageIcon],
    description: "AI system that creates realistic images and art from natural language descriptions."
  },
  { 
    id: 3, 
    name: "Copilot", 
    category: "Code", 
    icons: [Code, Code, Code],
    description: "AI-powered coding assistant that helps developers write better code faster."
  },
  { 
    id: 4, 
    name: "Whisper", 
    category: "Audio", 
    icons: [Music, Music, Music],
    description: "Automatic speech recognition system that can transcribe and translate multiple languages."
  },
  { 
    id: 5, 
    name: "Runway", 
    category: "Video", 
    icons: [Video, Video, Video],
    description: "AI-powered video editing tool for creative professionals."
  },
  { 
    id: 6, 
    name: "GPT-4", 
    category: "Text", 
    icons: [MessageSquare, MessageSquare, MessageSquare],
    description: "Latest large language model with improved reasoning and task completion capabilities."
  },
  { 
    id: 7, 
    name: "Stable Diffusion", 
    category: "Image", 
    icons: [ImageIcon, ImageIcon, ImageIcon],
    description: "Open-source image generation model capable of producing detailed images from text descriptions."
  },
  { 
    id: 8, 
    name: "Claude", 
    category: "Text", 
    icons: [MessageSquare, MessageSquare, MessageSquare],
    description: "AI assistant focused on task completion with strong ethical considerations."
  },
]