# Home Item Manager

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Ant Design Vue](https://img.shields.io/badge/Ant%20Design%20Vue-3.x-0170FE?logo=ant-design)](https://antdv.com/)
[![Ant Design X Vue](https://img.shields.io/badge/Ant%20Design%20X%20Vue-1.x-0170FE?logo=ant-design)](https://antd-design-x-vue.netlify.app/)

A smart home item management system with AI-powered chat interface, built with Vue 3 and TypeScript.

## ⚠️ Security Warning

This project currently uses OpenAI API directly in the frontend, which is **not recommended for production use**. The API key is exposed in the frontend code, which could lead to:

- Unauthorized usage of your API key
- Potential financial charges from API abuse
- Security vulnerabilities

For production use, we strongly recommend:

1. Deploying a backend service to handle API calls
2. Moving the API key to environment variables on the server
3. Implementing proper authentication and rate limiting
4. Using API key rotation and monitoring

See [SECURITY.md](SECURITY.md) for more details.

## Features

- 🤖 AI-powered chat interface for natural interaction
- 📦 Comprehensive item management (CRUD operations)
- 🏷️ Smart categorization and tagging
- ⏰ Expiration date tracking and reminders
- 📊 Low stock alerts
- 💾 Local storage for data persistence
- 📱 Responsive design
- 🌐 Multi-language support

## Tech Stack

- Vue 3
- TypeScript
- OpenAI API
- UI Frameworks:
  - [Ant Design Vue](https://antdv.com/) - Enterprise-class UI design language and Vue UI library
  - [Ant Design X Vue](https://antd-design-x-vue.netlify.app/) - AI-focused UI components for Vue
- Day.js
- Markdown-it

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/home-item-manager.git
cd home-item-manager
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the project root:

```env
VITE_OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
pnpm dev
```

### Development

```bash
# Type-check
pnpm type-check

# Lint
pnpm lint

# Build
pnpm build
```

## Project Structure

```
src/
├── components/     # Vue components
├── hooks/         # Vue composition API hooks
├── router/        # Vue router configuration
├── views/         # Page components
└── App.vue        # Root component
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vue.js](https://vuejs.org/)
- [OpenAI](https://openai.com/)
- [Ant Design Vue](https://antdv.com/)
- [Day.js](https://day.js.org/)
