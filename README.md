# React Process Builder with Docker 🔧

A modern React application featuring an interactive process builder interface with drag-and-drop functionality, built with TypeScript, Vite, and Tailwind CSS. The application includes comprehensive Docker support for development and testing environments.

##  Overview

This project demonstrates a sophisticated drag-and-drop interface where users can:
- Drag functional programming operations (map, filter, reduce, compress) between different containers
- Build processing pipelines using visual slots
- Manage multiple rows with independent palettes and trash areas
- Undo/Redo operations with persistent history
- Add new rows dynamically

##  Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS 4.1
- **Testing**: Vitest 3.1 + React Testing Library
- **Code Quality**: ESLint 9.21
- **Runtime**: Node.js 22.14.0 (Alpine Linux)
- **Containerization**: Docker

##  Features

### Process Builder Interface
- **Drag & Drop**: Intuitive drag-and-drop functionality for organizing functions
- **Multi-Row Support**: Create and manage multiple processing rows
- **Undo/Redo**: Full history management with localStorage persistence
- **Palette Management**: Each row has its own function palette
- **Trash System**: Remove unwanted functions to a dedicated trash area
- **State Persistence**: Automatically saves and restores session state

### Developer Experience
- Hot reloading development server
- Comprehensive test suite with snapshots
- Docker-based development environment
- TypeScript strict mode
- ESLint configuration with React-specific rules

##  Prerequisites

- **Docker**: Required for containerized development and testing
- **Node.js 22.14+**: If running locally without Docker
- **npm**: Package manager (or pnpm/yarn)

##  Installation & Setup

### Docker Development (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd docker-ts-npm-vite-main
   ```

2. **Build Docker image**
   ```bash
   ./build_docker.sh process_builder
   ```

3. **Run development server**
   ```bash
   ./build_docker.sh process_builder && docker run -it --rm -p 5173:5173 process_builder ./run_dev.sh
   ```
   
   Or use the convenience script:
   ```bash
   docker run --network=host -v .:/app -it process_builder ./run_dev.sh
   ```

4. **Access the application**
   Open your browser to `http://localhost:5173`

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Run All Tests (Docker)
```bash
./build_docker.sh process_builder && docker run -t process_builder ./run_tests.sh
```

### Run Specific Tests (Docker)
```bash
./build_docker.sh process_builder
docker run -t process_builder ./run_tests.sh basic  # Run tests matching "basic"
```

### Local Testing
```bash
npm test           # Run all tests
npm run test:ui    # Run tests with UI (if configured)
npm run lint       # Run ESLint
```

### Test Coverage
The project includes:
- **Unit Tests**: Component rendering and behavior
- **Integration Tests**: Drag-and-drop interactions
- **Snapshot Tests**: UI consistency verification
- **Setup Tests**: Testing environment configuration

##  Project Structure

```
├── src/
│   ├── App.tsx                 # Main application component
│   ├── ProcessBuilder.tsx      # Core drag-and-drop interface
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles
│   ├── App.css                # Component-specific styles
│   └── assets/                # Static assets
├── test/
│   ├── App.test.tsx           # App component tests
│   ├── ProcessBuilder.test.tsx # Process builder tests
│   ├── suite.test.ts          # Integration test suite
│   ├── setupTests.ts          # Test configuration
│   └── __snapshots__/         # Jest snapshots
├── public/                    # Static public assets
├── Dockerfile                 # Container configuration
├── docker-compose.yml         # Multi-container setup (if present)
├── build_docker.sh           # Docker build script
├── run_dev.sh                # Development server script
├── run_tests.sh              # Test execution script
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.js          # ESLint configuration
└── package.json              # Project dependencies and scripts
```

##  Configuration

### Vite Configuration
- React plugin with TypeScript support
- Tailwind CSS integration
- Vitest testing environment setup
- JSdom for browser simulation

### TypeScript Configuration
- Strict mode enabled
- Modern ES modules
- React JSX support
- Path mapping for clean imports

### Docker Configuration
- Multi-stage build optimization
- Alpine Linux for minimal image size
- Development and production environments
- Volume mounting for hot reloading

##  Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint |

### Docker Scripts

| Script | Description |
|--------|-------------|
| `./build_docker.sh [tag]` | Build Docker image |
| `./run_dev.sh` | Start development server in container |
| `./run_tests.sh [filter]` | Run tests in container |

##  Usage Examples

### Basic Process Building
1. Drag functions from the palette to slots
2. Functions can be swapped between slots
3. Drop unwanted functions in the trash
4. Use undo/redo to navigate changes
5. Add new rows for complex workflows

### Development Workflow
```bash
# Build and run with hot reloading
./build_docker.sh dev-app
docker run --network=host -v .:/app -it dev-app ./run_dev.sh

# Run tests during development
docker run -t dev-app ./run_tests.sh

# Run specific test patterns
docker run -t dev-app ./run_tests.sh ProcessBuilder
```

##  Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure port 5173 is available
2. **Docker build fails**: Check Docker is running and has sufficient resources
3. **Tests failing**: Verify Node.js version compatibility
4. **Hot reload not working**: Ensure proper volume mounting in Docker

### Debug Commands
```bash
# Check Docker image contents
docker run -it process_builder sh

# Verify build output
docker run -t process_builder npm run build

# Check dependency installation
docker run -t process_builder npm list
```
 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Maintain test coverage above 80%
- Use ESLint recommended configuration
- Add tests for new functionality
- Update documentation for API changes

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest Testing Framework](https://vitest.dev/)
- [Docker Documentation](https://docs.docker.com/)
