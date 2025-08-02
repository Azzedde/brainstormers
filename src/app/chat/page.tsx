'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSearchParams } from 'next/navigation';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { SummaryModal } from '@/components/SummaryModal';
import { ChatMessage, MethodType, UserSettings } from '@/types/brainstorm';
import { BRAINSTORMING_METHODS, getAllMethods } from '@/lib/brainstorm/methods';
import { getBrainstormClient } from '@/lib/llm/client';

function ChatContent() {
  const searchParams = useSearchParams();
  const initialMethod = searchParams.get('method') as MethodType || 'big-mind-mapping';
  
  const [currentMethod, setCurrentMethod] = useState<MethodType>(initialMethod);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBrainstormMode, setIsBrainstormMode] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isClientInitialized, setIsClientInitialized] = useState(false);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const methods = getAllMethods();
  const currentMethodData = BRAINSTORMING_METHODS[currentMethod];

  // Initialize client with settings from localStorage
  useEffect(() => {
    try {
      const settingsStr = localStorage.getItem('brainstorm-settings');
      if (settingsStr) {
        const settings: UserSettings = JSON.parse(settingsStr);
        getBrainstormClient(settings);
        setIsClientInitialized(true);
      } else {
        // Redirect to setup if no settings found
        window.location.href = '/setup';
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      window.location.href = '/setup';
    }
  }, []);

  // Auto-scroll to bottom only when new messages arrive (not on initial load or method changes)
  useEffect(() => {
    // Only scroll if we have more than just the welcome message and the last message is from assistant
    if (messages.length > 1 && messages[messages.length - 1]?.role === 'assistant') {
      // Use a more controlled scroll that doesn't go too far
      const chatContainer = document.querySelector('.flex-1.overflow-y-auto');
      if (chatContainer) {
        const scrollHeight = chatContainer.scrollHeight;
        const clientHeight = chatContainer.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;
        
        // Scroll to show the last message but not beyond the chat area
        chatContainer.scrollTo({
          top: Math.max(0, maxScrollTop - 100), // Leave some padding from bottom
          behavior: 'smooth'
        });
      }
    }
  }, [messages]);

  // Add welcome message only when starting fresh and client is initialized
  useEffect(() => {
    if (messages.length === 0 && isClientInitialized) {
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: isBrainstormMode
          ? `Welcome! I'm ready to help you with **${currentMethodData.name}** brainstorming.\n\n${currentMethodData.description}\n\n**When to use:** ${currentMethodData.whenToUse}\n\nWhat would you like to brainstorm about?`
          : `Hello! I'm here to help answer your questions and have a conversation. What would you like to talk about?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isClientInitialized, currentMethodData.description, currentMethodData.name, currentMethodData.whenToUse, isBrainstormMode]); // Only run when client is initialized, not on method/mode changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const client = getBrainstormClient();
      
      if (!client) {
        throw new Error('Client not initialized. Please configure your settings.');
      }
      
      let response: string;
      
      if (isBrainstormMode) {
        // For brainstorm mode, use generateIdeas
        const brainstormResponse = await client.generateIdeas({
          userInput: inputValue,
          method: currentMethod,
          context: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        });
        response = brainstormResponse.ideas.join('\n');
      } else {
        // For chat mode, use chat method
        const context = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        response = await client.chat(inputValue, context);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleMethodChange = (newMethod: MethodType) => {
    setCurrentMethod(newMethod);
    // Don't clear messages - keep chat history when changing method
  };

  const toggleMode = () => {
    setIsBrainstormMode(!isBrainstormMode);
    // Don't clear messages - keep chat history when switching modes
  };

  const clearChatHistory = () => {
    setMessages([]);
    // Add welcome message for the current mode/method
    const welcomeMessage: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: isBrainstormMode
        ? `Welcome! I'm ready to help you with **${currentMethodData.name}** brainstorming.\n\n${currentMethodData.description}\n\n**When to use:** ${currentMethodData.whenToUse}\n\nWhat would you like to brainstorm about?`
        : `Hello! I'm here to help answer your questions and have a conversation. What would you like to talk about?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const generateSummary = async () => {
    if (messages.length <= 1) return; // Don't generate summary for just the welcome message
    
    setIsGeneratingSummary(true);
    try {
      const client = getBrainstormClient();
      
      if (!client) {
        throw new Error('Client not initialized. Please configure your settings.');
      }
      
      // Generate summary using the chat method with a specific prompt
      const summaryPrompt = `Please provide a comprehensive summary of the following ${isBrainstormMode ? 'brainstorming session' : 'conversation'}:\n\n${messages.map(m => `${m.role}: ${m.content}`).join('\n\n')}\n\nProvide a clear, structured summary highlighting the key points, ideas, and conclusions.`;
      
      const summaryResponse = await client.chat(summaryPrompt);
      setSummary(summaryResponse);
      setShowSummaryModal(true);
    } catch (error) {
      console.error('Error generating summary:', error);
      // You might want to show an error toast here
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    // You might want to show a success toast here
  };

  const handleExportToPDF = () => {
    // This would require a PDF generation library
    console.log('Export to PDF functionality not yet implemented');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                Brainstormers
              </span>
              <span className="text-slate-500 dark:text-slate-400">|</span>
              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                {isBrainstormMode ? currentMethodData.name : 'Chat Mode'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 ${
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-6 py-4 shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                <MarkdownRenderer content={message.content} />
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg px-6 py-4 shadow-md border border-slate-200 dark:border-slate-700">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Control Buttons */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-4">
              {/* Beautiful Toggle Switch */}
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium transition-colors ${!isBrainstormMode ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  💬 Chat
                </span>
                <button
                  onClick={toggleMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isBrainstormMode ? 'bg-pink-500' : 'bg-blue-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isBrainstormMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium transition-colors ${isBrainstormMode ? 'text-pink-600 dark:text-pink-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  🧠 Brainstorm
                </span>
              </div>
              
              {isBrainstormMode && (
                <div className="relative">
                  <Button
                    onClick={() => setShowMethodSelector(!showMethodSelector)}
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 min-w-[200px] justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{currentMethodData.icon}</span>
                      <span className="font-medium">{currentMethodData.name}</span>
                    </div>
                    <span className={`transform transition-transform ${showMethodSelector ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </Button>
                  
                  {showMethodSelector && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
                      <div className="p-1">
                        {methods.map((method) => (
                          <div
                            key={method.id}
                            className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              currentMethod === method.id
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                            onClick={() => {
                              handleMethodChange(method.id as MethodType);
                              setShowMethodSelector(false);
                            }}
                            title={method.whenToUse}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{method.icon}</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                  {method.name}
                                </span>
                              </div>
                              {currentMethod === method.id && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </div>
                            
                            {/* Simple hover tooltip */}
                            <div className="absolute left-full top-0 ml-2 w-48 bg-slate-900 text-white text-sm rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-60 shadow-lg">
                              {method.whenToUse}
                              {/* Arrow */}
                              <div className="absolute left-0 top-3 w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-slate-900 -ml-1"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={clearChatHistory}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
              >
                🗑️ Clear Chat
              </Button>
              <Button
                onClick={generateSummary}
                disabled={messages.length <= 1 || isGeneratingSummary}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
              </Button>
            </div>
          </div>
          
          {/* Input Form */}
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-4">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isBrainstormMode ? "Share your ideas..." : "Ask me anything..."}
                className="flex-1 min-h-[60px] max-h-[200px] resize-none"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Summary Modal */}
      <SummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        summary={summary}
        onCopyToClipboard={handleCopyToClipboard}
        onExportToPDF={handleExportToPDF}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}