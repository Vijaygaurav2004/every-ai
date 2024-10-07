import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'framer-motion';
import { Sparkles, User, Lock, Mail, Brain, Code, Image as ImageIcon, MessageSquare, LogIn } from 'lucide-react';

const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please check your credentials and try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      setError('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl flex flex-col md:flex-row"
      >
        <div className="md:w-1/2 pr-8 mb-8 md:mb-0">
          <div className="flex items-center mb-8">
            <Sparkles className="h-12 w-12 text-purple-400 mr-4" />
            <h1 className="text-4xl font-bold text-white">Every AI</h1>
          </div>
          <p className="text-gray-300 mb-6">
            Unlock the power of AI with Every AI - your all-in-one platform for cutting-edge AI tools and services.
          </p>
          <div className="space-y-4">
            <FeatureItem icon={Brain} text="Advanced language models for natural conversations" />
            <FeatureItem icon={ImageIcon} text="AI-powered image generation and editing" />
            <FeatureItem icon={Code} text="Intelligent code assistance and generation" />
            <FeatureItem icon={MessageSquare} text="Multi-lingual translation and text analysis" />
          </div>
        </div>
        <div className="md:w-1/2 bg-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            {isSignUp ? 'Create an account' : 'Sign in to your account'}
          </h2>
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full bg-gray-600 text-white border-gray-500"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full bg-gray-600 text-white border-gray-500"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {isSignUp ? 'Sign Up' : 'Log In'}
            </Button>
          </form>
          <div className="mt-4">
            <Button onClick={handleGoogleSignIn} className="w-full bg-red-600 hover:bg-red-700 text-white">
              <LogIn className="mr-2 h-4 w-4" /> Sign in with Google
            </Button>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ElementType; text: string }> = ({ icon: Icon, text }) => (
  <div className="flex items-center">
    <Icon className="h-6 w-6 text-purple-400 mr-2" />
    <span className="text-gray-300">{text}</span>
  </div>
);

export default LandingPage;