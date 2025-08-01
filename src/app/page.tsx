'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <span className="text-3xl">🧠</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Unlock Your Creative Potential
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-600 dark:text-slate-300">
            Transform your ideas into breakthrough solutions with AI-powered brainstorming methodologies. 
            Explore new perspectives, overcome creative blocks, and innovate like never before.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href="/setup">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90">
                <span className="mr-2">✨</span>
                Start Brainstorming
                <span className="ml-2">→</span>
              </Button>
            </a>
            <Button size="lg" variant="outline">
              Learn How It Works
            </Button>
          </div>
        </div>

        {/* Method preview cards */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 max-w-4xl mx-auto">
          {methods.map((method, index) => (
            <Card key={method.id} className="p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="mb-2 text-3xl">{method.icon}</div>
              <p className="text-sm font-medium">{method.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Brainstormers</span>?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Our platform combines proven brainstorming techniques with cutting-edge AI to supercharge your creative process.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-3">
                  <span className="text-white text-xl">{feature.icon}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Get started in minutes with our simple, secure process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-4">Your Security is Our Priority</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <ul className="space-y-3">
                    {securityFeatures.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 mt-0.5 text-green-500">✓</span>
                        <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3">
                    {securityFeatures.slice(3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-3 mt-0.5 text-green-500">✓</span>
                        <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline">
                  <span className="mr-2">📖</span>
                  View Source Code
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="p-8 lg:p-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="text-4xl mb-6">⚡</div>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to Transform Your Ideas?
            </h2>
            <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
              Join thousands of innovators using AI-powered brainstorming to unlock their creative potential.
            </p>
            <a href="/setup">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90">
                <span className="mr-2">✨</span>
                Start Your Creative Journey
                <span className="ml-2">→</span>
              </Button>
            </a>
          </Card>
        </div>
      </section>
    </div>
  );
}

const methods = [
  { id: 'big-mind-mapping', name: 'Big Mind Mapping', icon: '🗺️' },
  { id: 'reverse-brainstorming', name: 'Reverse Brainstorming', icon: '🔄' },
  { id: 'role-storming', name: 'Role Storming', icon: '🎭' },
  { id: 'scamper', name: 'SCAMPER', icon: '🔧' },
  { id: 'six-thinking-hats', name: 'Six Thinking Hats', icon: '🎩' },
  { id: 'starbursting', name: 'Starbursting', icon: '⭐' },
];

const features = [
  {
    icon: '🧠',
    title: '6 Proven Methods',
    description: 'Access six powerful brainstorming techniques, each designed for specific creative challenges.',
  },
  {
    icon: '💡',
    title: 'AI-Powered Insights',
    description: 'Leverage advanced AI to generate unique perspectives and breakthrough ideas.',
  },
  {
    icon: '🚀',
    title: 'Instant Results',
    description: 'Get high-quality ideas in seconds, not hours. Accelerate your creative process.',
  },
  {
    icon: '👥',
    title: 'Multiple Perspectives',
    description: 'Explore problems from different angles with role-based and perspective-shifting techniques.',
  },
  {
    icon: '🎯',
    title: 'Structured Approach',
    description: 'Follow proven methodologies that guide you to comprehensive, actionable solutions.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your ideas and API keys stay safe with client-side processing and open-source transparency.',
  },
];

const steps = [
  {
    title: 'Choose Your Provider',
    description: 'Select from OpenAI, Groq, Gemini, or DeepSeek based on your preference.',
  },
  {
    title: 'Select a Method',
    description: 'Pick the brainstorming technique that best fits your creative challenge.',
  },
  {
    title: 'Generate Ideas',
    description: 'Watch as AI helps you explore new possibilities and breakthrough solutions.',
  },
];

const securityFeatures = [
  'Your API key is stored locally in your browser',
  'No data is sent to our servers - everything runs client-side',
  'Open-source code for complete transparency',
  'You can revoke your API key anytime',
  'Supports multiple trusted LLM providers',
];