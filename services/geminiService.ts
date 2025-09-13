import { GoogleGenAI } from "@google/genai";
import { AdvisorInput, GeminiResponse, GroundingChunk } from "../types";

// Initialize the GoogleGenAI client with the API key from environment variables.
// This instance is reused for all API calls in this service.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a random, realistic client profile for a given country to be used as an example.
 * This helps users quickly test the application without having to write a profile themselves.
 * @param country - The country to generate a profile for.
 * @returns A promise that resolves to a string containing the client profile.
 */
export const generateRandomProfile = async (country: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Generate a short, single-sentence, realistic client profile for a mortgage applicant in ${country}. 
    Focus on common scenarios.
    For example: "A young couple, first-time home buyers, looking for a sustainable home."
    or "A family with two children looking to upgrade to a larger, energy-efficient house."
    or "A single person under 30 looking to buy their first apartment in a city."
    Do not add any preamble or explanation. Just return the sentence.`;

    const result = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            // Disable thinking for this simple, creative task to get a faster response.
            thinkingConfig: { thinkingBudget: 0 }
        }
    });

    return result.text.trim();
  } catch (error) {
    console.error("Failed to generate random profile:", error);
    // Provide a generic fallback profile in case the API call fails.
    return "First-time home buyer, under 35 years old, looking to purchase a new energy-efficient apartment.";
  }
};

/**
 * Finds housing subsidies based on user input by calling the Gemini API with Google Search grounding.
 * @param input - The advisor's input, including country, client profile, and filters.
 * @returns A promise that resolves to an object containing the parsed API response and the list of sources.
 */
export const findSubsidies = async (
  input: AdvisorInput
): Promise<{ response: GeminiResponse; sources: GroundingChunk[] }> => {
  const { country, clientProfile, filters } = input;
  const model = "gemini-2.5-flash";

  // Dynamically build a list of filter clauses to add to the prompt.
  const filterClauses: string[] = [];
  if (filters.minGrantAmount) {
    filterClauses.push(`- The subsidy must provide a minimum grant amount of €${filters.minGrantAmount}.`);
  }

  const allEligibility = [...filters.eligibility];
  if (filters.customEligibility) {
    allEligibility.push(filters.customEligibility);
  }
  if (allEligibility.length > 0) {
    filterClauses.push(`- The client has the following characteristics: ${allEligibility.join(', ')}.`);
  }

  if (filters.subsidyTypes.length > 0) {
    filterClauses.push(`- Only consider subsidies of the following types: ${filters.subsidyTypes.join(', ')}.`);
  }

  // Construct the main prompt sent to the Gemini API.
  const prompt = `
    You are an expert advisor on EU housing subsidies.
    A user from ${country} is asking for information on mortgage and housing subsidies.
    Their client profile is: "${clientProfile}"

    ${filterClauses.length > 0 ? 'Please apply the following filters to your search:' : ''}
    ${filterClauses.join('\n')}

    Please find relevant national and regional government-backed subsidies for purchasing a primary residence based on this profile and the filters.
    For each subsidy you find, present it in the following JSON format within a \`subsidies\` array.
    Also provide an overall \`summary\` of the findings.

    The final output MUST be a single JSON object. Do not include markdown backticks or any other text outside of the JSON object.

    Example format:
    {
      "subsidies": [
        {
          "name": "Subsidy Name",
          "description": "Brief description of the subsidy.",
          "eligibility": ["Criteria 1", "Criteria 2", "Etc."],
          "potentialBenefit": "Description of the financial benefit."
        }
      ],
      "summary": "A summary of potential eligibility and next steps."
    }
  `;

  // Call the Gemini API to generate content.
  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      // Enable the googleSearch tool to ground the model's response in real-time information.
      // This is crucial for getting up-to-date subsidy details.
      tools: [{ googleSearch: {} }],
      // Disable thinking for a faster response, as search grounding provides the core information.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  // Extract the main text response and the grounding metadata.
  const responseText = result.text;
  const sources: GroundingChunk[] =
    (result.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    // Ensure that we only include sources that have a valid URI.
    .filter(chunk => chunk.web?.uri)
    .map(chunk => ({
      web: {
        uri: chunk.web!.uri!,
        // Provide a fallback title if the source is missing one.
        title: chunk.web!.title || chunk.web!.uri!,
      }
    }));
  
  let parsedResponse: GeminiResponse;
  try {
    // The model might wrap its JSON response in markdown backticks.
    // This cleaning step removes them to ensure the string is valid JSON before parsing.
    const cleanedText = responseText.replace(/^```json\n?/, "").replace(/```$/, "");
    parsedResponse = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", error);
    console.error("Raw response:", responseText);
    // If parsing fails, return a user-friendly error message within the expected structure.
    parsedResponse = {
      subsidies: [],
      summary: "I'm sorry, I couldn't process the information from the official sources. The format was unexpected. Please try rephrasing your request.",
    };
  }

  return { response: parsedResponse, sources };
};