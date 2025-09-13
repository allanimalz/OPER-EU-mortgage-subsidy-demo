# EU Mortgage Subsidy Copilot

An AI-powered copilot for European mortgage advisors to discover current mortgage and housing subsidies for their clients using grounded, real-time search across EU databases.

https://eu-mortgage-subsidy-copilot-1019661608867.us-west1.run.app/

## Overview

This application serves as an intelligent assistant for mortgage advisors operating within the European Union. It leverages the power of the Google Gemini API with grounding in verifiable primary sources to provide up-to-date, relevant, and verifiable information on housing subsidies. Advisors can input client profiles and specific criteria to quickly identify potential financial aid, streamlining the research process and providing value to their clients.

## ✨ Key Features

- **AI-Powered Subsidy Search**: Utilizes the `gemini-2.5-flash` model to understand complex client profiles and search queries.
- **Real-Time Information**: Integrates Google Search as a tool to ensure the information is current and grounded in official government sources.
- **Advanced Filtering**: Allows advisors to narrow down results by country, minimum grant amount, specific eligibility criteria (e.g., first-time buyer, energy efficiency), and subsidy type (e.g., grant, loan).
- **AI-Generated Summaries**: Provides a concise, high-level overview of the findings, complete with citations linking directly to the sources.
- **Detailed Subsidy Breakdowns**: Each discovered subsidy is presented with its name, a detailed description, eligibility requirements, and potential benefits.
- **Verifiable Sources**: All information is backed by a list of official sources, allowing advisors to verify details and direct clients to the correct resources.
- **Example Profile Generation**: A "Generate Example" feature instantly creates a realistic client profile, making it easy to test and demonstrate the tool's capabilities.
- **Responsive & Clean UI**: Built with React and Tailwind CSS for a modern, accessible, and easy-to-use experience on any device.

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- A modern web browser.
- A local web server to serve the static files. A popular and simple choice is `http-server` for Node.js.

### Configuration: Google Gemini API Key

This application requires a Google Gemini API key to function.

1.  **Get an API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create a new API key.
2.  **Set Environment Variable**: The application is designed to read the API key from a `process.env.API_KEY` variable. How you set this will depend on your development environment. For many local development servers (like Vite or Create React App), you can create a `.env` file in the root of your project.

    Create a file named `.env` in the project root and add the following line, replacing `YOUR_API_KEY` with the key you obtained:

    ```
    API_KEY=YOUR_API_KEY
    ```

    **Note**: The current setup with static files does not have a built-in way to process `.env` files. You would typically need a bundler like Vite or Webpack. For simple local testing, you might need to hardcode the key, but this is **not recommended** for production.

### Running the Application

1.  **Clone the repository (if applicable) or download the files.**
2.  **Navigate to the project directory** in your terminal.
3.  **Start a local web server.** If you have Node.js and `http-server` installed, you can run:
    ```bash
    npx http-server
    ```
4.  **Open your browser** and navigate to the local address provided by the server (e.g., `http://localhost:8080`).

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
