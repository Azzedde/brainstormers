'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-1/3 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse delay-3000"></div>
      </div>

      <div className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Main footer content */}
          <div className="text-center mb-12">
            {/* Creator section with avatar */}
            <div className="mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-2xl ring-4 ring-blue-500/20">
                  <Image
                    src="/avatar.jpg"
                    alt="Azzedine Idir Aitsaid - Creator of Brainstormers"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Created with ❤️ by Azzedine Idir Aitsaid
              </h3>
              <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                Passionate developer and innovator crafting AI-powered solutions to unlock human creativity. 
                Turning ideas into reality, one brainstorm at a time.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link
                href="https://azzedde.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-white text-sm font-bold">🌐</span>
                  </div>
                  <span className="text-white font-medium group-hover:text-blue-300 transition-colors">Portfolio</span>
                </Card>
              </Link>

              <Link
                href="https://github.com/Azzedde"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-white text-sm font-bold">⚡</span>
                  </div>
                  <span className="text-white font-medium group-hover:text-purple-300 transition-colors">GitHub</span>
                </Card>
              </Link>

              <Link
                href="https://www.linkedin.com/in/azzedine-idir-aitsaid-7bab84229/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-white text-sm font-bold">💼</span>
                  </div>
                  <span className="text-white font-medium group-hover:text-blue-300 transition-colors">LinkedIn</span>
                </Card>
              </Link>

              <Link
                href="https://x.com/azzedde"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-white text-sm font-bold">𝕏</span>
                  </div>
                  <span className="text-white font-medium group-hover:text-sky-300 transition-colors">Twitter</span>
                </Card>
              </Link>
            </div>

            {/* Sponsorship/Venture Section */}
            <div className="mb-8">
              <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Let's Build Something Amazing Together
                  </h4>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Interested in sponsoring this project, turning it into a venture, or collaborating on innovative AI solutions? 
                    I'm always excited to connect with fellow innovators and explore new opportunities.
                  </p>
                  <Link
                    href="mailto:aitsaid.azzedineidir@gmail.com"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    <span className="text-xl group-hover:rotate-12 transition-transform duration-300">📧</span>
                    <span>Get In Touch</span>
                    <span className="text-sm opacity-75 group-hover:opacity-100 transition-opacity">
                      aitsaid.azzedineidir@gmail.com
                    </span>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Bottom section */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-slate-400 text-sm">
                  © 2024 Brainstormers. Crafted with passion and AI.
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span>Made with</span>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 animate-pulse">❤️</span>
                    <span>Next.js</span>
                    <span>•</span>
                    <span>TypeScript</span>
                    <span>•</span>
                    <span>Tailwind CSS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </footer>
  );
}