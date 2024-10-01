import { useState } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { ScrollArea } from "./components/ui/scroll-area"
import ToolInterface from './components/ToolInterface'
import { 
  Search, 
  Home, 
  FolderOpen, 
  Users, 
  Plus, 
  Play, 
  User,
  ChevronDown,
  MessageSquare,
  Image as ImageIcon,
  Code,
  Music,
  Video,
  FileText,
  MoreHorizontal
} from 'lucide-react'

const categories = [
  "All", "Text", "Image", "Code", "Audio", "Video", "Document", "Other"
]

const aiTools = [
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

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTool, setActiveTool] = useState<string | null>(null)

  const filteredTools = aiTools.filter(tool => 
    (selectedCategory === "All" || tool.category === selectedCategory) &&
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openToolInterface = (toolName: string) => {
    setActiveTool(toolName)
  }

  if (activeTool) {
    return <ToolInterface toolName={activeTool} onBack={() => setActiveTool(null)} />
  }

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-16 flex-shrink-0 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold">
          AI
        </div>
        <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon"><Home className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon"><FolderOpen className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon"><Users className="h-5 w-5" /></Button>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <Input 
              className="w-full max-w-md bg-white/10 border-0 placeholder-white/50 text-white" 
              placeholder="Search AI Tools & Prompts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" />
                Add New Tool
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white hidden sm:flex">
                <Play className="h-4 w-4 mr-2" />
                Start New Project
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Your AI Workplace for all your needs</h1>
            <p className="text-sm sm:text-lg mb-4">Get all your AI workflows with custom recommendations with the best AI tools with Eve Engine</p>
            <Button className="bg-white/20 hover:bg-white/30 text-white">
              Get Recommendation
            </Button>
          </div>
        </header>

        {/* Category Filters */}
        <div className="bg-gray-800 p-4 flex items-center space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category ? "bg-white text-black" : "text-white hover:bg-gray-700"
              }`}
            >
              {category}
            </Button>
          ))}
          <Button variant="ghost" className="text-white hover:bg-gray-700">
            More
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Tools Grid */}
        <ScrollArea className="flex-grow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex space-x-2">
                    {tool.icons.map((Icon, index) => (
                      <div key={index} className="w-8 h-8 bg-gray-600 rounded-md flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                <Button 
                  variant="default" 
                  className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => openToolInterface(tool.name)}
                >
                  Open {tool.category === "Image" ? "Image Generator" : "Tool"}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default App