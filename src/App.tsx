import React, { useState, useEffect, useRef } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import LandingPage from './components/LandingPage';
import ToolInterface from './components/ToolInterface'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { ScrollArea } from "./components/ui/scroll-area"
import { 
  Search, Home, FolderOpen, Users, Plus, Play, User,
  ChevronDown, MessageSquare, Image as ImageIcon, Code,
  Music, Video, FileText, MoreHorizontal, LogOut, Sun, Moon
} from 'lucide-react'
import useClickOutside from './hooks/useClickOutside'

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
  const [user, loading] = useAuthState(auth);
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useClickOutside(userMenuRef, () => setShowUserMenu(false))

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const filteredTools = aiTools.filter(tool => 
    (selectedCategory === "All" || tool.category === selectedCategory) &&
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openToolInterface = (toolName: string) => {
    setActiveTool(toolName)
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <LandingPage />;
  }

  if (activeTool) {
    return <ToolInterface toolName={activeTool} onBack={() => setActiveTool(null)} />
  }

  return (
    <div className={`flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg z-20"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Every AI</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FolderOpen className="mr-2 h-4 w-4" /> Projects
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" /> Collaborations
          </Button>
        </nav>
        <Button variant="ghost" onClick={handleLogout} className="mt-auto">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center space-x-4 flex-grow">
            <Input 
              className="max-w-md"
              placeholder="Search AI Tools & Prompts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startAdornment={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="relative" ref={userMenuRef}>
              <Button variant="ghost" size="icon" onClick={() => setShowUserMenu(!showUserMenu)}>
                <User className="h-5 w-5" />
              </Button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                    {user?.email}
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <Button
                    variant="ghost"
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2 inline-block" /> Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Category Filters */}
        <ScrollArea className="flex-shrink-0 bg-gray-50 dark:bg-gray-800 p-4">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Tools Grid */}
        <ScrollArea className="flex-grow p-6">
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex space-x-2">
                        {tool.icons.map((Icon, index) => (
                          <div key={index} className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{tool.description}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4">
                    <Button 
                      variant="default" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => openToolInterface(tool.name)}
                    >
                      Open {tool.category === "Image" ? "Image Generator" : "Tool"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </div>
    </div>
  )
}

export default App