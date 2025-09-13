# EU Mortgage Subsidy Copilot

An AI-powered copilot for European mortgage advisors to discover current mortgage and housing subsidies for their clients using grounded, real-time search across EU databases.

![EU Mortgage Subsidy Copilot Screenshot](https://storage.googleapis.com/aistudio-ux-team-public/sdk-pro-examples/eu-mortgage-copilot.png)

## Overview

This application serves as an intelligent assistant for mortgage advisors operating within the European Union. It leverages the power of the Google Gemini API with Google Search grounding to provide up-to-date, relevant, and verifiable information on housing subsidies. Advisors can input client profiles and specific criteria to quickly identify potential financial aid, streamlining the research process and providing immense value to their clients.

## ✨ Key Features

- **AI-Powered Subsidy Search**: Utilizes the `gemini-2.5-flash` model to understand complex client profiles and search queries.
- **Real-Time Information**: Integrates Google Search as a tool to ensure the information is current and grounded in official government sources.
- **Advanced Filtering**: Allows advisors to narrow down results by country, minimum grant amount, specific eligibility criteria (e.g., first-time buyer, energy efficiency), and subsidy type (e.g., grant, loan).
- **AI-Generated Summaries**: Provides a concise, high-level overview of the findings, complete with citations linking directly to the sources.
- **Detailed Subsidy Breakdowns**: Each discovered subsidy is presented with its name, a detailed description, eligibility requirements, and potential benefits.
- **Verifiable Sources**: All information is backed by a list of official sources, allowing advisors to verify details and direct clients to the correct resources.
- **Example Profile Generation**: A "Generate Example" feature instantly creates a realistic client profile, making it easy to test and demonstrate the tool's capabilities.
- **Responsive & Clean UI**: Built with React and Tailwind CSS for a modern, accessible, and easy-to-use experience on any device.

## 🚀 Getting Started: Running the App Locally

This guide provides detailed instructions to set up and run the project on your local machine.

The application code is written to use an API key from an environment variable (`process.env.API_KEY`). To handle this correctly during local development, we will use [Vite](https://vitejs.dev/), a modern and fast development server.

### Prerequisites

-   **Node.js and npm**: You need to have Node.js (version 18 or newer) and npm installed. You can download them from the official [Node.js website](https://nodejs.org/).
-   **Google Gemini API Key**: You must have a Gemini API key. You can create one at [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step-by-Step Instructions

#### Step 1: Get the Project Files

First, download or clone the project files to a local directory on your computer.

```bash
# If you have git installed, you can clone it:
git clone https://github.com/your-repo/eu-mortgage-subsidy-copilot.git

# Then navigate into the project directory
cd eu-mortgage-subsidy-copilot
```

#### Step 2: Create a `package.json` File

This file will manage the project's development dependencies (specifically, Vite). Create a new file named `package.json` in the root of your project directory and add the following content:

```json
{
  "name": "eu-mortgage-subsidy-copilot",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

#### Step 3: Install Dependencies

Open your terminal in the project directory and run the following command to install the packages defined in `package.json`:

```bash
npm install
```

#### Step 4: Configure the API Key

Create a new file named `.env` in the root of your project directory. This file will securely store your API key. **This file should not be committed to version control.**

Add your API key to the `.env` file in the following format:

```
API_KEY=YOUR_GEMINI_API_KEY
```
Replace `YOUR_GEMINI_API_KEY` with the actual key you obtained from Google AI Studio.

#### Step 5: Create a Vite Configuration File

To make the API key from the `.env` file available to the application code as `process.env.API_KEY`, we need a Vite configuration file.

Create a new file named `vite.config.js` in the project root and add the following code:

```javascript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Pass the API_KEY to the client-side code
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
```

#### Step 6: Run the Development Server

You're all set! Run the following command in your terminal to start the Vite development server:

```bash
npm run dev
```

Vite will start the server and print a local URL in your terminal, which is typically `http://localhost:5173/`.

#### Step 7: Open the Application

Open your web browser and navigate to the URL provided by Vite. The EU Mortgage Subsidy Copilot should now be running correctly.

## 🛠️ How It Works

-   **Frontend**: The user interface is built with **React** and **TypeScript**, providing a robust and type-safe component structure. **Tailwind CSS** is used for rapid, utility-first styling.
-   **Gemini API Service**: The `services/geminiService.ts` file contains the core logic for interacting with the Google Gemini API.
    -   It constructs a detailed prompt based on the user's input from the `AdvisorInputForm`.
    -   It makes a call to the `gemini-2.5-flash` model using `ai.models.generateContent`.
    -   Crucially, it enables the `googleSearch` tool, which allows the model to perform real-time web searches to find the most accurate and current subsidy information.
    -   The response from the model includes both the generated text (the JSON data and summary) and the `groundingMetadata`, which contains the URLs of the websites it used as sources.
-   **State Management**: The main application state (loading status, results, errors) is managed within the `App.tsx` component using React's `useState` hook.
-   **Component Structure**: The UI is broken down into logical, reusable components located in the `components/` directory, such as the input form, results display, and loading spinners.

## 📁 Project Structure

```
.
├── components/               # Reusable React components
│   ├── AdvisorInputForm.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── icons/
│   │   └── Icons.tsx
│   ├── LoadingSpinner.tsx
│   ├── SubsidyResults.tsx
│   └── SubsidyVisualization.tsx
├── services/                 # API interaction logic
│   └── geminiService.ts
├── App.tsx                   # Main application component
├── constants.ts              # Application-wide constants (e.g., country list)
├── index.html                # Main HTML entry point
├── index.tsx                 # React application root
├── metadata.json             # Application metadata
└── types.ts                  # TypeScript type definitions
```

## ⚖️ Disclaimer

This tool provides AI-generated information for advisory purposes only. It is not a substitute for professional financial advice. Always verify details with official government sources before making any decisions.
