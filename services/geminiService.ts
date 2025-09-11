import { GoogleGenAI } from "@google/genai";
import { AdvisorInput, GeminiResponse, GroundingChunk } from "../types";

// Fix: Initialize GoogleGenAI with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
            // Disable thinking for faster, more direct responses.
            thinkingConfig: { thinkingBudget: 0 }
        }
    });

    return result.text.trim();
  } catch (error) {
    console.error("Failed to generate random profile:", error);
    // Fallback profile
    return "First-time home buyer, under 35 years old, looking to purchase a new energy-efficient apartment.";
  }
};

export const findSubsidies = async (
  input: AdvisorInput
): Promise<{ response: GeminiResponse; sources: GroundingChunk[] }> => {
  const { country, clientProfile, filters } = input;
  // Fix: Use the recommended 'gemini-2.5-flash' model.
  const model = "gemini-2.5-flash";

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

  // Fix: Use generateContent with googleSearch tool for up-to-date information.
  // Do not use responseSchema or responseMimeType with googleSearch.
  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  // Fix: Extract text response and grounding metadata correctly.
  const responseText = result.text;
  // Fix: The GroundingChunk type from the Gemini API has an optional `uri`, but the app's type requires it.
  // Filter out chunks without a URI and map the result to the app's type, providing a fallback for the title.
  const sources: GroundingChunk[] =
    (result.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter(chunk => chunk.web?.uri)
    .map(chunk => ({
      web: {
        uri: chunk.web!.uri!,
        title: chunk.web!.title || chunk.web!.uri!,
      }
    }));
  
  let parsedResponse: GeminiResponse;
  try {
    // The response might have markdown ```json ... ```. We need to strip that before parsing.
    const cleanedText = responseText.replace(/^```json\n?/, "").replace(/```$/, "");
    parsedResponse = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", error);
    console.error("Raw response:", responseText);
    // Return a default error state if parsing fails
    parsedResponse = {
      subsidies: [],
      summary: "I'm sorry, I couldn't process the information from the official sources. The format was unexpected. Please try rephrasing your request.",
    };
  }

  return { response: parsedResponse, sources };
};
