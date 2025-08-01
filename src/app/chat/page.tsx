'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { SummaryModal } from '@/components/SummaryModal';
import { ChatMessage, BrainstormSession, MethodType } from '@/types/brainstorm';
import { BRAINSTORMING_METHODS, getAllMethods } from '@/lib/brainstorm/methods';
import { getBrainstormClient } from '@/lib/llm/client';

function ChatContent() {
  const searchParams = useSearchParams();
  const initialMethod = searchParams.get('method') as MethodType || 'big-mind-mapping';
  
  const [currentMethod, setCurrentMethod] = useState<MethodType>(initialMethod);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [isBrainstormMode, setIsBrainstormMode] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const methods = getAllMethods();
  const currentMethodData = BRAINSTORMING_METHODS[currentMethod];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message only when starting fresh
  useEffect(() => {
    if (messages.length === 0) {
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
  }, [currentMethod, isBrainstormMode]); // Only run when method or mode changes

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
    setMessages([]); // Clear messages when changing method
  };

  const toggleMode = () => {
    setIsBrainstormMode(!isBrainstormMode);
    setMessages([]); // Clear messages when switching modes
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                Brainstormers
              </Link>
              <span className="text-slate-500 dark:text-slate-400">|</span>
              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                {isBrainstormMode ? currentMethodData.name : 'Chat Mode'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleMode}
                variant="outline"
                className="text-sm"
              >
                Switch to {isBrainstormMode ? 'Chat' : 'Brainstorm'} Mode
              </Button>
              
              {isBrainstormMode && (
                <Select value={currentMethod} onValueChange={(value) => handleMethodChange(value as MethodType)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {methods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Button
                onClick={generateSummary}
                disabled={messages.length <= 1 || isGeneratingSummary}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
              </Button>
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
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-4">
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