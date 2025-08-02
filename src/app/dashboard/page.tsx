'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const methods = [
    {
      id: 'big-mind-mapping',
      name: 'Big Mind Mapping',
      icon: '🗺️',
      description: 'Explore ideas across a wide scope to gather the maximum number of creative solutions.',
      whenToUse: 'Perfect when you are lost and want to gather the maximum number of ideas',
      gradient: 'from-blue-500 to-cyan-500',
      examples: ['Product features brainstorming', 'Business model exploration', 'Content idea generation']
    },
    {
      id: 'reverse-brainstorming',
      name: 'Reverse Brainstorming',
      icon: '🔄',
      description: 'Identify ways to cause problems to reveal potential issues and innovative solutions.',
      whenToUse: 'Great for spotting potential issues and coming up with innovative solutions',
      gradient: 'from-purple-500 to-pink-500',
      examples: ['Improving customer retention', 'Identifying security vulnerabilities', 'Preventing project failures']
    },
    {
      id: 'role-storming',
      name: 'Role Storming',
      icon: '🎭',
      description: 'Adopt different perspectives to generate diverse insights and creative solutions.',
      whenToUse: 'Excellent for gathering insights from different viewpoints and stakeholders',
      gradient: 'from-green-500 to-teal-500',
      examples: ['User experience design', 'Stakeholder problem solving', 'Inclusive solution creation']
    },
    {
      id: 'scamper',
      name: 'SCAMPER',
      icon: '🔧',
      description: 'Transform ideas systematically using Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse.',
      whenToUse: 'Ideal for improving existing ideas or products through systematic transformation',
      gradient: 'from-orange-500 to-red-500',
      examples: ['Product improvement', 'Process innovation', 'Resource optimization']
    },
    {
      id: 'six-thinking-hats',
      name: 'Six Thinking Hats',
      icon: '🎩',
      description: 'Examine problems from six perspectives: Data, Emotions, Risks, Benefits, Creativity, and Process.',
      whenToUse: 'Perfect for comprehensive analysis and balanced decision-making',
      gradient: 'from-indigo-500 to-purple-500',
      examples: ['Business decisions', 'Project evaluation', 'Complex problem analysis']
    },
    {
      id: 'starbursting',
      name: 'Starbursting',
      icon: '⭐',
      description: 'Generate comprehensive questions using Who, What, Where, When, Why, and How for thorough exploration.',
      whenToUse: 'Excellent for comprehensive topic exploration and understanding requirements',
      gradient: 'from-yellow-500 to-orange-500',
      examples: ['Project planning', 'Customer research', 'Market exploration']
    }
  ];

  const handleStartBrainstorming = (methodId: string) => {
    // Navigate to the chat interface with the selected method as a parameter
    window.location.href = `/chat?method=${methodId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xl">🧠</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Brainstormers</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">Choose your brainstorming method</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <span className="mr-2">⚙️</span>
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <span className="mr-2">📚</span>
                History
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Choose Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Brainstorming Method</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Each method is designed for specific creative challenges. Select the one that best fits your current needs.
          </p>
        </div>

        {/* Method Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {methods.map((method) => (
            <Card
              key={method.id}
              className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                selectedMethod === method.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="p-6">
                {/* Method Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.gradient} flex items-center justify-center text-2xl`}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{method.name}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">
                  {method.description}
                </p>

                {/* When to Use */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">When to Use</div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{method.whenToUse}</p>
                </div>

                {/* Examples */}
                <div className="mb-4">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Examples</div>
                  <div className="flex flex-wrap gap-1">
                    {method.examples.map((example, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded-full text-slate-600 dark:text-slate-300"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartBrainstorming(method.id);
                  }}
                  className={`w-full bg-gradient-to-r ${method.gradient} text-white hover:opacity-90 transition-opacity`}
                >
                  <span className="mr-2">✨</span>
                  Start {method.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Start Section */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Not sure which method to choose?</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Try our quick recommendation based on your specific challenge or start with Big Mind Mapping for general exploration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline">
                <span className="mr-2">🎯</span>
                Get Recommendation
              </Button>
              <Button
                onClick={() => handleStartBrainstorming('big-mind-mapping')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              >
                <span className="mr-2">🗺️</span>
                Start with Big Mind Mapping
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}