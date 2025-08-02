'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SetupPage() {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      icon: '🤖',
      description: 'The go-to LLM provider, first in the market with strong models',
      apiKeyUrl: 'https://platform.openai.com/settings/organization/api-keys',
      models: [
        { id: 'o4-mini', name: 'o4-mini', description: 'Perfect for complex queries and long thinking, but expensive, but cheap reasoning model compared to others' },
        { id: 'gpt-4o', name: 'gpt-4o', description: 'Globally good, good for complex thinking' },
        { id: 'gpt-4o-mini', name: 'gpt-4o-mini', description: 'Fast, cheap and good' },
        { id: 'gpt-4.1-nano', name: 'gpt-4.1-nano', description: 'Cheapest and fastest, best for easiest use cases and very fast sessions' },
      ]
    },
    {
      id: 'groq',
      name: 'Groq',
      icon: '⚡',
      description: 'The fastest provider in the world, has a lot of open source models hosted in their infra and are the best and fastest really',
      apiKeyUrl: 'https://console.groq.com/keys',
      models: [
        { id: 'qwen2.5-32b-instruct', name: 'qwen2.5-32b-instruct', description: 'Good reasoning model strong and yet cheap' },
        { id: 'llama-3.3-70b-versatile', name: 'llama-3.3-70b-versatile', description: 'Latest meta model, cheap, good reasoning, mixture of experts' },
        { id: 'deepseek-r1-distill-llama-70b', name: 'deepseek-r1-distill-llama-70b', description: 'Globally good, good reasoning, expensive, complex' },
      ]
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      icon: '🔮',
      description: 'Good globally good models that have a lot of knowledge and that have a very big context window making brainstorming sessions very long and can think of toooo much things in same time',
      apiKeyUrl: 'https://aistudio.google.com/app/apikey',
      models: [
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Enhanced thinking and reasoning, multimodal understanding, advanced coding, and more' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Adaptive thinking, cost efficiency' },
        { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B', description: 'Most cost-efficient model supporting high throughput' },
      ]
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      icon: '🧠',
      description: 'A very very good LLM provider and yet is veeeery cheap the cheapest of them all so if you want efficiency in your budget chose this LLM provider it is really perfect',
      apiKeyUrl: 'https://platform.deepseek.com/api_keys',
      models: [
        { id: 'deepseek-chat', name: 'deepseek-chat', description: 'Cheap and good globally' },
        { id: 'deepseek-reasoner', name: 'deepseek-reasoner', description: 'For more complex tasks, more expensive but cheaper than reasoning models of other providers' },
      ]
    },
  ];

  const handleContinue = async () => {
    if (!selectedProvider || !apiKey) return;
    
    setIsValidating(true);
    
    try {
      // Save settings to localStorage
      const finalModel = customModel.trim() || selectedModel || getDefaultModel(selectedProvider);
      const settings = {
        apiKey,
        selectedProvider,
        selectedModel: finalModel,
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
    const provider = providers.find(p => p.id === providerId);
    return provider?.models[0]?.id || 'gpt-4o-mini';
  };

  const getSelectedProvider = () => {
    return providers.find(p => p.id === selectedProvider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Brainstormers</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Let&apos;s get you set up with your preferred AI provider
          </p>
        </div>

        {/* Introduction Message */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <span className="text-3xl">💡</span>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">About This Open Source Project</h2>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                This is mainly an open source project and I don&apos;t have the money to make it a full product, so I don&apos;t have the money to pay for LLM providers.
                But you can enjoy the product if you provide the LLM provider that you want!
              </p>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                This is actually a <strong>great idea</strong> because when you provide your own LLM provider, you are free to use any LLM from anywhere in the world as you want.
                So for now, the product uses the following providers that you can choose from:
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <div className="space-y-8">
            {/* Provider Selection */}
            <div>
              <label className="block text-lg font-semibold mb-4">Choose Your AI Provider</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`p-5 border rounded-xl cursor-pointer transition-all ${
                      selectedProvider === provider.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      setSelectedProvider(provider.id);
                      setSelectedModel('');
                      setCustomModel('');
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl">{provider.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{provider.name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {provider.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            {selectedProvider && (
              <div className="space-y-4">
                <label className="block text-lg font-semibold">Choose a Model</label>
                <div className="grid grid-cols-1 gap-3">
                  {getSelectedProvider()?.models.map((model) => (
                    <div
                      key={model.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedModel === model.id
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                      }`}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setCustomModel('');
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-slate-500 mt-1">{model.description}</div>
                        </div>
                        {selectedModel === model.id && (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Custom Model Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Or use a custom model</label>
                  <Input
                    type="text"
                    placeholder="Enter exact model name (e.g., gpt-4.1-nano-preview)"
                    value={customModel}
                    onChange={(e) => {
                      setCustomModel(e.target.value);
                      if (e.target.value.trim()) {
                        setSelectedModel('');
                      }
                    }}
                    className="font-mono"
                  />
                  <div className="text-xs text-slate-500">
                    Make sure to enter the exact model name as specified by the provider
                  </div>
                </div>
              </div>
            )}

            {/* API Key Input */}
            {selectedProvider && (
              <div className="space-y-3">
                <label className="block text-lg font-semibold">API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <span>Get your API key here: </span>
                  <Link
                    href={getSelectedProvider()?.apiKeyUrl || '#'}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    {getSelectedProvider()?.apiKeyUrl}
                  </Link>
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
                      <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-100">
                        <Link href="https://github.com/Azzedde/brainstormers" target="_blank">

                        <span className="mr-2">📖</span>
                        View Source Code
                      </Link>
                      </Button>
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
                disabled={!selectedProvider || !apiKey || isValidating || (!selectedModel && !customModel.trim())}
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