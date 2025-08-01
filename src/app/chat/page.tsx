'use client';

import { useState, useEffect, useRef } from 'react';
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

export default function ChatPage() {
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
        timestamp: new Date(),
        methodUsed: isBrainstormMode ? currentMethod : undefined
      };
      setMessages([welcomeMessage]);
    }
  }, [currentMethodData, messages.length, currentMethod, isBrainstormMode]);

  // Add method/mode change notification when method or mode changes (but not on initial load)
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastWasBrainstorm = lastMessage?.methodUsed !== undefined;
      const modeChanged = lastWasBrainstorm !== isBrainstormMode;
      const methodChanged = isBrainstormMode && lastMessage?.methodUsed !== currentMethod;
      
      if (modeChanged || methodChanged) {
        let content: string;
        if (modeChanged && !isBrainstormMode) {
          content = `Switched to **💬 Chat mode**. I'll continue our conversation in a more natural, conversational style.`;
        } else if (modeChanged && isBrainstormMode) {
          content = `Switched to **🧠 Brainstorming mode** with **${currentMethodData.name}**. I'll continue our conversation using this structured approach.\n\n${currentMethodData.description}`;
        } else {
          content = `Switched to **${currentMethodData.name}** method. I'll continue our conversation using this approach while keeping our previous discussion in context.\n\n${currentMethodData.description}`;
        }
        
        const changeMessage: ChatMessage = {
          id: `change-${Date.now()}`,
          role: 'assistant',
          content,
          timestamp: new Date(),
          methodUsed: isBrainstormMode ? currentMethod : undefined
        };
        setMessages(prev => [...prev, changeMessage]);
      }
    }
  }, [currentMethod, currentMethodData, messages, isBrainstormMode]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      methodUsed: currentMethod
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get user settings from localStorage
      const settingsJson = localStorage.getItem('brainstorm-settings');
      if (!settingsJson) {
        throw new Error('No API settings found. Please go to setup first.');
      }
      
      const settings = JSON.parse(settingsJson);
      
      if (!settings.apiKey || !settings.selectedProvider || !settings.selectedModel) {
        throw new Error('Incomplete API settings. Please reconfigure your settings.');
      }

      const client = getBrainstormClient(settings);
      if (!client) {
        throw new Error('Failed to initialize brainstorm client');
      }

      // Build comprehensive context from chat history
      const chatHistory = messages
        .filter(m => m.role !== 'system')
        .slice(-10) // Get last 10 messages for context
        .map(m => {
          if (m.role === 'user') {
            return `User: ${m.content}`;
          } else {
            return `Assistant (${m.methodUsed ? BRAINSTORMING_METHODS[m.methodUsed]?.name : 'General'}): ${m.content}`;
          }
        })
        .join('\n\n');
      
      let assistantMessage: ChatMessage;
      
      if (isBrainstormMode) {
        // Brainstorming mode - use structured prompts
        const fullPrompt = chatHistory ?
          `IMPORTANT CONTEXT - Previous conversation:\n\n${chatHistory}\n\n---\n\nNow, using the ${currentMethodData.name} method, respond to this request:\n${inputValue}\n\nIMPORTANT: When the user refers to "the previous idea" or similar references, they are referring to the ideas discussed in the conversation above. Make sure to directly reference and analyze those specific ideas.` :
          inputValue;

        const response = await client.generateIdeas({
          method: currentMethod,
          userInput: fullPrompt,
          context: '' // We're including context in the userInput now for better clarity
        });

        assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.ideas.join('\n\n'),
          timestamp: new Date(),
          methodUsed: currentMethod,
          treeData: response.treeData
        };
      } else {
        // Chat mode - use the new chat method
        const chatContext = chatHistory ?
          `Previous conversation:\n\n${chatHistory}\n\n---\n\n` :
          undefined;

        const response = await client.chat(inputValue, chatContext);

        assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          methodUsed: undefined
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const isSettingsError = error instanceof Error &&
        (error.message.includes('API settings') || error.message.includes('settings found'));
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. ${
          isSettingsError ? 'Please go to [Setup](/setup) to configure your API settings.' : 'Please try again.'
        }`,
        timestamp: new Date(),
        methodUsed: currentMethod
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMethodChange = (newMethod: MethodType) => {
    setCurrentMethod(newMethod);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const generateSummary = async () => {
    if (messages.length === 0) return;
    
    setIsGeneratingSummary(true);
    try {
      const settings = JSON.parse(localStorage.getItem('brainstorm-settings') || '{}');
      if (!settings.apiKey || !settings.selectedProvider) {
        throw new Error('Please configure your API settings first');
      }

      const client = getBrainstormClient(settings);
      if (!client) {
        throw new Error('Failed to initialize brainstorm client');
      }

      // Build the full conversation for summary
      const fullConversation = messages
        .map(m => {
          const methodLabel = m.methodUsed ? ` (${BRAINSTORMING_METHODS[m.methodUsed]?.name})` : '';
          return `${m.role}${methodLabel}: ${m.content}`;
        })
        .join('\n\n');

      const summaryPrompt = `Please provide a comprehensive summary of this brainstorming session. Include:

1. **Session Overview**: What topics were discussed and what brainstorming methods were used
2. **Key Ideas Generated**: The most important and innovative ideas that emerged
3. **Main Insights**: Key insights and patterns that emerged from the discussion
4. **Action Items**: Any concrete next steps or recommendations
5. **Method Effectiveness**: Brief note on which brainstorming methods were most productive

Here's the full conversation:

${fullConversation}

Please format your summary in clear markdown with proper headers and bullet points.`;

      const response = await client.generateIdeas({
        method: 'big-mind-mapping',
        userInput: summaryPrompt,
        context: ''
      });

      setSummary(response.ideas.join('\n\n'));
      setShowSummaryModal(true);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      alert('Summary copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const exportToPDF = () => {
    // Create a simple HTML document for PDF export
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Brainstorming Session Summary</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1, h2, h3 { color: #333; }
          ul, ol { margin-left: 20px; }
          .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🧠 Brainstorming Session Summary</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div>${summary.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainstorming-summary-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <span className="mr-2">←</span>
                  Back
                </Button>
              </Link>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg">🧠</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Brainstorm Chat</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {currentMethodData.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateSummary}
                disabled={messages.length === 0 || isGeneratingSummary}
              >
                {isGeneratingSummary ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Summarizing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📄</span>
                    Summarize
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={clearChat}>
                Clear Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{currentMethodData.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{currentMethodData.name}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto">
                  {currentMethodData.description}
                </p>
                <div className="text-sm text-slate-500">
                  Start typing your brainstorming topic below...
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-slate-800 border'
                  }`}
                >
                  {message.role === 'assistant' && message.methodUsed && (
                    <div className="flex items-center space-x-2 mb-2 text-sm text-slate-500">
                      <span>{BRAINSTORMING_METHODS[message.methodUsed]?.icon}</span>
                      <span>{BRAINSTORMING_METHODS[message.methodUsed]?.name}</span>
                    </div>
                  )}
                  <MarkdownRenderer content={message.content} />
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3xl rounded-lg px-4 py-3 bg-white dark:bg-slate-800 border">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-slate-500">
                      {isBrainstormMode ? 'Generating ideas...' : 'Answering...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4">
            {/* Mode Toggle and Method Selector */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Mode:
                  </label>
                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setIsBrainstormMode(true)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        isBrainstormMode
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      🧠 Brainstorm
                    </button>
                    <button
                      onClick={() => setIsBrainstormMode(false)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        !isBrainstormMode
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      💬 Chat
                    </button>
                  </div>
                </div>
                
                {isBrainstormMode && (
                  <Select value={currentMethod} onValueChange={handleMethodChange}>
                  <SelectTrigger className="w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <span>{currentMethodData.icon}</span>
                        <span>{currentMethodData.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                    {methods.map((method) => (
                      <SelectItem
                        key={method.id}
                        value={method.id}
                        className="hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-700"
                        title={method.whenToUse}
                      >
                        <div className="flex items-center justify-between w-full py-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{method.icon}</span>
                            <span className="font-medium">{method.name}</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 ml-2 max-w-48 truncate">
                            {method.whenToUse}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isBrainstormMode
                    ? `Ask me to brainstorm using ${currentMethodData.name}...`
                    : `Ask me anything...`}
                  className="min-h-[60px] max-h-32 resize-none"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 px-6"
              >
                <span className="mr-2">✨</span>
                Send
              </Button>
            </div>
            <div className="text-xs text-slate-500 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>

      {/* Summary Modal */}
      <SummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        summary={summary}
        onCopyToClipboard={copyToClipboard}
        onExportToPDF={exportToPDF}
      />
    </div>
  );
}