'use client';
import Link from 'next/link';
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
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90">

            <Link href="/setup">
                <span className="mr-2">✨</span>
                Start Brainstorming
                <span className="ml-2">→</span>
            </Link>
              </Button>

            <Button size="lg" variant="outline">
              <Link href="#how-it-works" scroll>
                Learn How It Works
              </Link>
            </Button>
          </div>
        </div>

        {/* Method preview cards */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {methods.map((method, index) => (
            <a
              key={method.id}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500"></div>
                <div className="relative p-6 h-full flex flex-col items-center justify-center text-center">
                  <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl text-white">{method.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {method.name}
                  </h3>
                  <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to learn more →
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Brainstormers</span>?
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Our platform combines proven brainstorming techniques with cutting-edge AI to supercharge your creative process.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-8 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>
                <div className="relative h-full flex flex-col">
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-lg group-hover:scale-110 transition-transform duration-300 w-fit">
                    <span className="text-white text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
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
                                      <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-100">

                <Link href="https://github.com/Azzedde/brainstormers" target="_blank">

                        <span className="mr-2">📖</span>
                        View Source Code
                </Link>
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
            <div className="mt-6">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90">

            <Link href="/setup">
                <span className="mr-2">✨</span>
                Start Your Creative Journey
                <span className="ml-2">→</span>
            </Link>
            </Button>
                      </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

const methods = [
  {
    id: 'big-mind-mapping',
    name: 'Big Mind Mapping',
    icon: '🗺️',
    link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10900480/'
  },
  {
    id: 'reverse-brainstorming',
    name: 'Reverse Brainstorming',
    icon: '🔄',
    link: 'https://www.researchgate.net/publication/343888460_Deconstruction_of_Idea_Generation_Methods_Into_a_Framework_of_Creativity_Mechanisms'
  },
  {
    id: 'role-storming',
    name: 'Role Storming',
    icon: '🎭',
    link: 'https://www.researchgate.net/publication/343888460_Deconstruction_of_Idea_Generation_Methods_Into_a_Framework_of_Creativity_Mechanisms'
  },
  {
    id: 'scamper',
    name: 'SCAMPER',
    icon: '🔧',
    link: 'https://en.wikipedia.org/wiki/SCAMPER'
  },
  {
    id: 'six-thinking-hats',
    name: 'Six Thinking Hats',
    icon: '🎩',
    link: 'https://en.wikipedia.org/wiki/Six_Thinking_Hats'
  },
  {
    id: 'starbursting',
    name: 'Starbursting',
    icon: '⭐',
    link: 'https://www.researchgate.net/publication/343888460_Deconstruction_of_Idea_Generation_Methods_Into_a_Framework_of_Creativity_Mechanisms'
  },
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