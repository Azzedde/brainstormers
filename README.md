# 🧠 Brainstormers - AI-Powered Brainstorming Tool

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai" alt="OpenAI" />
</div>

<div align="center">
  <h3>Transform your ideas with structured AI-powered brainstorming methods</h3>
  <p>Built with Next.js, TypeScript, and OpenAI's GPT models</p>
</div>

---

## ✨ Features

### 🎯 Structured Brainstorming Methods

- **[Big Mind Mapping](https://arxiv.org/abs/2310.19275)** - Expand ideas across a wide scope for maximum idea generation
- **[Reverse Brainstorming](https://info.orchidea.dev/innovation-blog/guide-to-ai-powered-brainstorming-sessions)** - Identify potential problems to reveal innovative solutions
- **[Role Storming](https://www.psychologytoday.com/us/blog/the-digital-self/202403/how-ai-can-transform-brainstorming)** - Adopt different perspectives for diverse insights
- **[SCAMPER](https://www.interaction-design.org/literature/article/learn-how-to-use-the-best-ideation-methods-scamper)** - Apply systematic creative thinking techniques
- **[Six Thinking Hats](https://www.groupmap.com/portfolio/six-thinking-hats)** - Examine ideas from six different angles
- **[Starbursting](https://lucidspark.com/blog/how-to-use-starbursting-for-brainstorming)** - Generate comprehensive questions using 5W1H

### 🚀 Modern Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: Zustand for global state
- **AI Integration**: OpenAI GPT models with streaming support
- **Markdown**: React Markdown for rich content display

### 💡 Key Features

- 🌊 **Real-time streaming** responses from AI
- 🎨 **Beautiful UI** with smooth animations and transitions
- 📱 **Fully responsive** design for all devices
- 🔐 **Secure API key** management
- 📊 **Session history** tracking
- 🎯 **Structured output** with organized idea trees
- 🌙 **Dark mode** support (coming soon)

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Azzedde/brainstormers
   cd brainstormers
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key to `.env.local`:
   ```env
   OPENAI_API_KEY=your-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Getting Started

1. **Initial Setup**: On first visit, you'll be prompted to enter your OpenAI API key
2. **Choose a Method**: Select from six different brainstorming techniques
3. **Enter Your Topic**: Describe what you want to brainstorm about
4. **Get AI-Powered Ideas**: Receive structured, method-specific brainstorming results
5. **Explore and Expand**: Dive deeper into generated ideas with follow-up questions

### Brainstorming Methods Explained

#### 🗺️ Big Mind Mapping
Best for: Initial exploration, broad idea generation
- Generates multiple main branches of ideas
- Each branch expands into detailed sub-ideas
- Perfect for starting new projects

#### 🔄 Reverse Brainstorming
Best for: Problem-solving, risk identification
- Identifies ways to cause the problem
- Flips negative aspects into solutions
- Great for debugging and improvement

#### 🎭 Role Storming
Best for: User experience, stakeholder analysis
- Views topic from different personas
- Generates perspective-specific insights
- Ideal for product development

#### 🔧 SCAMPER
Best for: Product innovation, creative solutions
- Systematic approach using 7 techniques
- Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse
- Excellent for iterating on existing ideas

#### 🎩 Six Thinking Hats
Best for: Comprehensive analysis, team decisions
- White: Facts and data
- Red: Emotions and intuition
- Black: Risks and caution
- Yellow: Benefits and optimism
- Green: Creativity and alternatives
- Blue: Process and control

#### ⭐ Starbursting
Best for: Planning, thorough exploration
- Generates questions using Who, What, Where, When, Why, How
- Provides detailed answers to each question
- Perfect for project planning

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy your Brainstormers app:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Azzedde/brainstormers)

1. Click the button above
2. Add your `OPENAI_API_KEY` in environment variables
3. Deploy!

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app's URL (for production) | No |

### Customization

- **Styling**: Modify `src/app/globals.css` and Tailwind config
- **Methods**: Add new brainstorming methods in `src/lib/brainstorm/methods.ts`
- **Prompts**: Customize AI prompts in `src/lib/brainstorm/prompts.ts`

## 📊 Cost Efficiency

- Average session cost: ~$0.01-0.02
- Optimized prompts for minimal token usage
- Streaming responses for better UX without extra cost

## 🗺️ Roadmap

- [ ] Local LLM support (Ollama integration)
- [ ] Export brainstorming results (PDF, Markdown)
- [ ] Collaborative brainstorming sessions
- [ ] Custom brainstorming method builder
- [ ] Integration with note-taking apps
- [ ] Mobile app (React Native)
- [ ] Voice input support
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by proven brainstorming methodologies
- Built with amazing open-source tools
- Special thanks to the AI/ML community

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Azzedde/brainstormers/issues)
- **Discussions**: [Join the conversation](https://github.com/Azzedde/brainstormers/discussions)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Azzedde">Azzedde</a></p>
  <p>If you find this project helpful, please consider giving it a ⭐</p>
</div>
