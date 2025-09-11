# EU Mortgage Subsidy Copilot

## Demo
Public Demo
https://eu-mortgage-subsidy-copilot-530013073407.us-west1.run.app/


EU Mortgage Subsidy Copilot is a web application that helps users discover and understand government-backed mortgage and housing subsidies available across EU countries. By leveraging AI, it provides tailored recommendations and summaries based on individual profiles, eligibility, and user-specified filters.

## Purpose

The main goal of this app is to simplify the process of finding and comparing national and regional subsidies for purchasing a primary residence in the EU. Users can quickly identify potential grants, loans, or tax credits they may be eligible for, along with a clear breakdown of benefits and requirements.

## How It Works

1. **User Input:**  
   Users fill out a form specifying their country, a profile description (e.g., "First-time home buyer, under 35"), and optional filters including minimum grant amount, eligibility criteria (such as energy efficiency or low income), and the types of subsidies of interest.

2. **AI-Powered Search:**  
   The app sends the user’s information to an AI advisor prompt, which is configured to act as an expert on EU housing subsidies. Filters and profile details are incorporated to ensure results are relevant and specific.

3. **Subsidy Discovery:**  
   The AI searches for matching government-backed mortgage subsidies. For each subsidy, the app presents:
   - Name and description
   - Detailed eligibility criteria (with citations)
   - The estimated potential benefit (with citations)

4. **Results and Visualization:**  
   Results include an AI-generated summary and a visualization comparing potential benefits across found subsidies. If no subsidies match, the user is informed and encouraged to explore other programs.

5. **Citation and Transparency:**  
   All claims and benefit estimates are linked to their original sources for transparency. Source lists are provided for further reading.

## Application Logic Overview

- **Form Handling:**  
  The main form component (`AdvisorInputForm`) collects user data and manages eligibility and filter settings.
- **AI Query:**  
  A service (`geminiService.ts`) generates a prompt and queries the Gemini AI model, returning a structured JSON response describing each subsidy and a summary.
- **Results and Visualization:**  
  The results are rendered as expandable cards (`SubsidyResults` and `SubsidyCard`), with eligibility and benefit details, and visualized using `SubsidyVisualization`.
- **Citations:**  
  Citations within descriptions and summaries are parsed and rendered as clickable links for easy source verification.

## Running Locally

**Prerequisites:**  
- Node.js

**Setup:**
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your Gemini API key in `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```


---

> **Note:** All benefit estimates and program details are provided for informational purposes. Actual eligibility and amounts may vary based on specific circumstances and the most recent government data.
