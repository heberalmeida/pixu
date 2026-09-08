# Pixu Vue Example

Complete working example of Pixu Vue component with multiple compression scenarios.

## Features

- Basic compression example
- Advanced options with live controls
- Preset-based compression
- Real-time progress tracking
- Error handling
- Responsive design

## Installation

1. Install dependencies:

```bash
npm install
```

2. Make sure Pixu is built:

```bash
cd ../..
npm run build
```

## Running

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
examples/vue/
├── src/
│   ├── App.vue          # Main application component
│   ├── main.ts          # Application entry point
│   └── style.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── package.json         # Dependencies
└── README.md            # This file
```

## Examples Included

1. **Basic Compression**: Simple compression with default options
2. **Advanced Options**: Compression with customizable quality, dimensions, format, and metadata stripping
3. **Preset Compression**: Using predefined compression presets (web, print, social, thumbnail, email)

## Usage

The example demonstrates:

- Importing the PixuCompressor component
- Handling compression events
- Displaying compression results
- Error handling
- Progress tracking

## Requirements

- Node.js 18+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

