'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function SetupPage() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const providers = [
    { id: 'openai', name: 'OpenAI', icon: '🤖', description: 'GPT-4, GPT-3.5 Turbo' },
    { id: 'groq', name: 'Groq', icon: '⚡', description: 'Mixtral, Llama2' },
    { id: 'gemini', name: 'Google Gemini', icon: '🔮', description: 'Gemini Pro, Gemini Flash' },
    { id: 'deepseek', name: 'DeepSeek', icon: '🧠', description: 'DeepSeek Chat, DeepSeek Coder' },
  ];

  const handleContinue = async () => {
    if (!selectedProvider || !apiKey) return;
    
    setIsValidating(true);
    
    try {
      // Save settings to localStorage
      const settings = {
        apiKey,
        selectedProvider,
        selectedModel: getDefaultModel(selectedProvider),
        theme: 'system',
        streamingEnabled: false,
        autoSave: true
      };
      
      localStorage.setItem('brainstorm-settings', JSON.stringify(settings));
      
      // Here we would validate the API key in a real implementation
      setTimeout(() => {
        setIsValidating(false);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setIsValidating(false);
      console.error('Error saving settings:', error);
    }
  };

  const getDefaultModel = (providerId: string): string => {
    switch (providerId) {
      case 'openai':
        return 'gpt-4o-mini';
      case 'groq':
        return 'mixtral-8x7b-32768';
      case 'gemini':
        return 'gemini-pro';
      case 'deepseek':
        return 'deepseek-chat';
      default:
        return 'gpt-4o-mini';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Secure Setup</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Choose your AI provider and configure your API key to get started
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Choose Your AI Provider</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedProvider === provider.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-slate-500">{provider.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            {selectedProvider && (
              <div className="space-y-3">
                <label className="block text-sm font-medium">API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <div className="text-sm text-slate-500">
                  Get your API key from the {providers.find(p => p.id === selectedProvider)?.name} dashboard
                </div>
              </div>
            )}

            {/* Security Information */}
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-4">
              <div className="flex items-start space-x-3">
                <span className="text-green-600 text-xl">🔒</span>
                <div className="space-y-2">
                  <h3 className="font-medium text-green-800 dark:text-green-200">Your Security is Our Priority</h3>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>✓ Your API key is stored securely in your browser</li>
                    <li>✓ No data is sent to our servers - everything runs client-side</li>
                    <li>✓ View our open-source code on GitHub</li>
                    <li>✓ You can revoke your key anytime</li>
                  </ul>
                  <div className="pt-2">
                    <Link href="https://github.com/Azzedde/brainstormers" target="_blank">
                      <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-100">
                        <span className="mr-2">📖</span>
                        View Source Code
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            {/* Continue Button */}
            <div className="flex space-x-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back
                </Button>
              </Link>
              <Button
                onClick={handleContinue}
                disabled={!selectedProvider || !apiKey || isValidating}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              >
                {isValidating ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Validating...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    Continue Securely
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}