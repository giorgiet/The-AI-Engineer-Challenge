# Frontend - Next.js Chat Application

A modern, responsive Next.js 14+ application with dark theme that connects to the FastAPI backend for AI-powered chat.

## Features

- **Next.js 14+ App Router** - Modern React framework with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Dark Theme** - Modern dark color scheme with excellent contrast
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **FastAPI Integration** - Connects to backend at `http://localhost:8000/api/chat`

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- FastAPI backend running on `http://localhost:8000`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server (default port: 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Main chat page
│   └── globals.css     # Global styles with Tailwind
├── package.json        # Dependencies and scripts
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

## Backend Connection

The frontend connects to the FastAPI backend at:
- **Endpoint**: `http://localhost:8000/api/chat`
- **Method**: POST
- **Request Body**: `{ "message": "your message here" }`
- **Response**: `{ "reply": "AI response here" }`

Make sure your FastAPI backend is running before using the frontend.

## Deployment

This application is configured for Vercel deployment. Simply connect your repository to Vercel and it will automatically build and deploy.
