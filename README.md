# 🤖 Aigin

<div align="center">
  <img src="client/public/logo-dark.svg" alt="Aigin Logo" width="120" height="120">
  
  **Next-generation AI chat platform with extensive model support and powerful extensibility**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=flat&logo=trpc&logoColor=white)](https://trpc.io/)
  [![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
</div>

---

## ✨ Features

### 🎯 **Core Capabilities**

- **Multi-Provider AI Support**: Seamlessly switch between OpenAI, Anthropic, Google, Groq, DeepSeek, XAI, Azure, and OpenRouter
- **Real-time Streaming**: Live response streaming with delta updates and typing indicators
- **Smart Chat Management**: Automatic title generation, conversation history, and intelligent categorization
- **Modern UI/UX**: Beautiful dark/light theme with responsive design and smooth animations

### 🔧 **Extensibility (MCP Integration)**

- **Plugin Architecture**: Extend functionality with Model Context Protocol (MCP) applications
- **Pre-built Integrations**: 15+ ready-to-use apps including:
  - **📝 Productivity**: Notion, Outline, ClickUp, GitHub
  - **💾 Databases**: MongoDB, with Atlas support
  - **🌐 Web Services**: Fetch, TMDB, Chess.com
  - **💬 Communication**: Email client with IMAP/SMTP
  - **🧠 Memory**: Persistent conversation memory
  - **🔧 System**: FurryOS (NixOS package manager), Gitea

### 🛡️ **Enterprise Ready**

- **Kubernetes Native**: Full containerization with auto-scaling capabilities
- **User Authentication**: OIDC integration with multi-user support
- **Resource Management**: Configurable CPU/memory limits and persistent storage
- **Security**: API key management, user isolation, and secure communication

## 🏗️ Architecture

Aigin follows a modern microservices architecture designed for scalability and maintainability:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Hono Server    │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)      │◄──►│   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         │              ┌──────────────────┐
         │              │   Kubernetes     │
         │              │   (MCP Apps)     │
         └──────────────┼──────────────────┼───────────────
                        │                  │
                ┌───────▼────┐    ┌────────▼────┐
                │ MCP App 1  │    │ MCP App N   │
                │ (Pod)      │    │ (Pod)       │
                └────────────┘    └─────────────┘
```

### 🎨 **Frontend (Client)**

- **Framework**: Next.js 15 with App Router and Turbopack
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query + tRPC for type-safe API calls
- **UI Components**: Radix UI primitives with custom styling
- **Real-time**: tRPC subscriptions for live chat updates

### ⚡ **Backend (Server)**

- **Runtime**: Node.js with Hono web framework
- **API**: tRPC for end-to-end type safety
- **AI Integration**: Vercel AI SDK with custom provider registry
- **Authentication**: OIDC with automatic user provisioning
- **Database**: MongoDB with Mongoose ODM

### 🚀 **Infrastructure**

- **Orchestration**: Kubernetes for MCP app deployment
- **Containerization**: Docker with multi-stage builds
- **Storage**: Persistent volumes for stateful apps
- **Networking**: Service mesh with automatic discovery

## 🎛️ Supported AI Models

Aigin supports **50+ flagship models** across multiple providers:

| Provider       | Models                       | Capabilities              |
| -------------- | ---------------------------- | ------------------------- |
| **OpenAI**     | GPT-4.1, GPT-4o, o3, o4-mini | Vision, Reasoning, Tools  |
| **Anthropic**  | Claude 3.5/3.7 Sonnet        | Vision, Files, Analysis   |
| **Google**     | Gemini 2.5 Pro               | Vision, Search, Reasoning |
| **Meta**       | Llama 4 Scout/Maverick       | Vision, Open Source       |
| **DeepSeek**   | v3, R1                       | Reasoning, Cost-effective |
| **XAI**        | Grok 3, Grok 3 Mini          | Real-time, Reasoning      |
| **OpenRouter** | 100+ models                  | Unified access            |

### 🧠 **Advanced Features**

- **Reasoning Models**: Support for o3, DeepSeek R1, Grok 3
- **Vision Capabilities**: Image analysis across multiple providers
- **Tool Calling**: Function calling with MCP integration
- **Context Management**: Smart context window handling
- **Cost Optimization**: Automatic model selection based on task

## 🔌 MCP Applications

### Available Apps

| App            | Type               | Description                    |
| -------------- | ------------------ | ------------------------------ |
| 📝 **Notion**  | Productivity       | Note-taking and organization   |
| 📊 **Outline** | Documentation      | Team knowledge base            |
| ✅ **ClickUp** | Project Management | Task and project tracking      |
| 🐙 **GitHub**  | Development        | Repository management          |
| 🗄️ **MongoDB** | Database           | NoSQL database operations      |
| 🌐 **Fetch**   | Web                | HTTP requests and web scraping |
| 📧 **Email**   | Communication      | IMAP/SMTP email client         |
| 🧠 **Memory**  | AI Enhancement     | Persistent conversation memory |
| 📦 **FurryOS** | System             | NixOS package management       |

### 🛠️ Adding Custom Apps

1. **Define your app** in `server/src/constants/apps.ts`:

```typescript
{
  type: 'container/stdio',
  slug: 'my-app',
  name: 'My Custom App',
  description: 'Custom integration',
  configuration: [
    {
      id: 'api_key',
      name: 'API Key',
      description: 'Your API key'
    }
  ],
  environment: [
    {
      variable: 'MY_APP_API_KEY',
      template: '{{api_key}}'
    }
  ],
  image: 'my-org/my-app:latest',
  runCommand: 'my-app-binary'
}
```

2. **Configure in UI**: Users can enable and configure apps through the settings panel

3. **Use in chats**: Reference with `@{app:my-app} your prompt here`

## 🎨 Core Functions & Components

### 🔄 **Chat Generation System**

**`CachedChat` Class** (`server/src/ai/generation-manager.ts`):

- Manages real-time message streaming
- Handles tool calling and MCP integration
- Automatic title generation
- Database synchronization

### 🎯 **Model Registry** (`server/src/ai/registry.ts`)

Dynamic provider management with middleware:

- **Provider Registration**: Auto-discovery of available models
- **Middleware System**: Custom handling for different providers
- **Model Wrapping**: Unified interface across providers

### 📡 **Real-time Communication**

**tRPC Subscriptions**:

- `chat.stream`: Live message updates
- `chat.getAll`: Chat history with real-time sync
- Event-driven architecture with user isolation

## 🚀 Advanced Features

### 🔄 **Streaming & Real-time**

- **Delta Updates**: Character-by-character streaming
- **Event System**: Real-time chat status and notifications
- **Auto-scroll**: Smart scrolling with user control
- **Typing Indicators**: Visual feedback during generation

### 🧠 **Intelligent Features**

- **Smart Titles**: AI-generated conversation titles
- **Context Awareness**: MCP apps provide rich context
- **Model Selection**: Automatic optimal model choosing
- **Error Handling**: Graceful fallbacks and retries

### 📊 **Analytics & Monitoring**

- **Usage Tracking**: Model usage and performance metrics
- **Resource Monitoring**: Kubernetes pod health
- **Error Reporting**: Comprehensive logging system

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) for AI integration
- [Model Context Protocol](https://modelcontextprotocol.io/) for extensibility
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [tRPC](https://trpc.io/) for type-safe APIs

---

<div align="center">
  <strong>Built with ❤️ for the AI community and hate for Vercel</strong>
  
  [Website](https://ai.agin.rocks)
</div>

_This document was mostly generated using AI heh_
